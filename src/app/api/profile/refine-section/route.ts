import { RequestContext } from "@mastra/core/request-context";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
    experienceRefineAgent,
    profileSummaryAgent,
    projectRefineAgent,
} from "@/mastra/agents/resume-agent";
import { configSchema, experienceOutputSchema, projectsOutputSchema, refineProfileSectionSchema } from "@/components/features/profile/schema/profile-refine-schema";



function createRequestContext(config: z.infer<typeof configSchema>) {
    const requestContext = new RequestContext();
    requestContext.set("provider", config.provider);
    requestContext.set("modelName", config.modelName);
    requestContext.set("apiKey", config.apiKey);
    return requestContext;
}


function getReasoningErrorMessage(error: unknown) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("type 'reasoning'")) {
        return "The model returned an incomplete reasoning response. Please retry the action.";
    }

    if (message.includes("AI_APICallError")) {
        return "The provider/model request failed. Please retry the action.";
    }

    return null;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body?.config?.provider || !body?.config?.modelName || !body?.config?.apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: "AI configuration not found in aiConfig table.",
                },
                { status: 400 },
            );
        }

        const parsed = refineProfileSectionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid request payload.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const requestContext = createRequestContext(parsed.data.config);
        if (parsed.data.section === "summary") {
            const summaryData = parsed.data;
            const result = await profileSummaryAgent.generate(
                `Refine this resume summary for ATS readability and recruiter clarity. Keep facts unchanged.\n\nSummary:\n${summaryData.summary}\n\nSkills:\n${summaryData.skills.join(", ")}`,
                {
                    requestContext,
                    modelSettings: {
                        maxOutputTokens: 700,
                        maxRetries: 2,
                    },
                },
            );

            return NextResponse.json({
                success: true,
                section: "summary",
                refined: {
                    summary: result.text?.trim() ?? summaryData.summary,
                },
            });
        }

        if (parsed.data.section === "experience") {
            const experienceData = parsed.data;
            const result = await experienceRefineAgent.generate(
                `Refine these resume experience entries. Return strict JSON for the schema and keep all facts truthful to input.\n\nInput JSON:\n${JSON.stringify({ experience: experienceData.experience }, null, 2)}`,
                {
                    requestContext,
                    structuredOutput: {
                        schema: experienceOutputSchema,
                        jsonPromptInjection: true,
                    },
                    modelSettings: {
                        maxOutputTokens: 2200,
                        maxRetries: 2,
                    },
                },
            );

            const refined = experienceOutputSchema.safeParse(result.object);
            if (!refined.success) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "AI returned invalid experience format.",
                    },
                    { status: 400 },
                );
            }

            return NextResponse.json({
                success: true,
                section: "experience",
                refined: {
                    experience: refined.data.experience,
                },
            });
        }

        const projectsData = parsed.data;
        const result = await projectRefineAgent.generate(
            `Refine these resume project entries. Return strict JSON for the schema and keep all facts truthful to input.\n\nInput JSON:\n${JSON.stringify({ projects: projectsData.projects }, null, 2)}`,
            {
                requestContext,
                structuredOutput: {
                    schema: projectsOutputSchema,
                    jsonPromptInjection: true,
                },
                modelSettings: {
                    maxOutputTokens: 2200,
                    maxRetries: 2,
                },
            },
        );

        const refined = projectsOutputSchema.safeParse(result.object);
        if (!refined.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "AI returned invalid projects format.",
                },
                { status: 400 },
            );
        }

        return NextResponse.json({
            success: true,
            section: "projects",
            refined: {
                projects: refined.data.projects,
            },
        });
    } catch (error) {
        const message =
            getReasoningErrorMessage(error) ??
            (error instanceof Error
                ? error.message
                : "Unable to refine profile section.");

        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 400 },
        );
    }
}
