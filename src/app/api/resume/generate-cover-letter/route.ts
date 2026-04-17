import { RequestContext } from "@mastra/core/request-context";
import { NextResponse } from "next/server";
import { coverLetterAgent, coverLetterOutputSchema } from "@/mastra/agents/cover-letter-agent";
import { generateCoverLetterSchema } from "@/lib/validations/cover-letter-validation";


export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body?.config?.provider || !body?.config?.modelName || !body?.config?.apiKey) {
            return NextResponse.json(
                { success: false, error: "AI configuration is required." },
                { status: 400 },
            );
        }

        const parsed = generateCoverLetterSchema.safeParse(body);

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

        const { companyName, jobDescription, profileData, config } = parsed.data;

        const requestContext = new RequestContext();
        requestContext.set("provider", config.provider);
        requestContext.set("modelName", config.modelName);
        requestContext.set("apiKey", config.apiKey);

        const prompt = `Write a cover letter for the following job application.

CANDIDATE NAME: ${profileData.profile.fullName}
COMPANY: ${companyName}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE (JSON — use only the facts present here, never fabricate):
${JSON.stringify({
            summary: profileData.summary,
            skills: profileData.skills,
            experience: profileData.experience,
            projects: profileData.projects,
        }, null, 2)}

Return the cover letter JSON strictly matching the requested schema.`;

        const result = await coverLetterAgent.generate(prompt, {
            requestContext,
            structuredOutput: {
                schema: coverLetterOutputSchema,
                jsonPromptInjection: true,
            },
            modelSettings: {
                maxOutputTokens: 2000,
                maxRetries: 2,
            },
        });

        const coverLetter = result.object;

        if (!coverLetter) {
            return NextResponse.json(
                { success: false, error: "The AI model did not return a valid response. Please retry." },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true, coverLetter });
    } catch (error) {
        const message = error instanceof Error ? error.message : "";

        if (message.includes("type 'reasoning'")) {
            return NextResponse.json(
                { success: false, error: "The model returned an incomplete reasoning response. Please retry." },
                { status: 500 },
            );
        }

        if (message.includes("AI_APICallError") || message.includes("API_KEY")) {
            return NextResponse.json(
                { success: false, error: "The AI provider request failed. Check your API key and retry." },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to generate cover letter. Please try again." },
            { status: 500 },
        );
    }
}
