import { RequestContext } from "@mastra/core/request-context";
import { NextResponse } from "next/server";
import { jdTailorAgent, jdTailorOutputSchema } from "@/mastra/agents/jd-tailor-agent";
import { generateCompanyResumeSchema } from "@/lib/validations/company-resume-validations";



export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body?.config?.provider || !body?.config?.modelName || !body?.config?.apiKey) {
            return NextResponse.json(
                { success: false, error: "AI configuration is required." },
                { status: 400 },
            );
        }

        const parsed = generateCompanyResumeSchema.safeParse(body);

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

        const prompt = `Tailor this resume for the following company and job description.

COMPANY: ${companyName}

JOB DESCRIPTION:
${jobDescription}

BASE PROFILE (JSON):
${JSON.stringify(profileData, null, 2)}

Return the tailored resume JSON strictly matching the requested schema. Do not alter the profile personal info (name, email, phone, etc.) — only tailor: summary, skills, experience, projects, education, certifications, and languages.`;

        const result = await jdTailorAgent.generate(prompt, {
            requestContext,
            structuredOutput: {
                schema: jdTailorOutputSchema,
                jsonPromptInjection: true,
            },
            modelSettings: {
                maxOutputTokens: 4000,
                maxRetries: 2,
            },
        });

        const tailored = result.object;

        if (!tailored) {
            return NextResponse.json(
                { success: false, error: "The AI model did not return a valid response. Please retry." },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true, resume: tailored });
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
            { success: false, error: "Failed to generate company resume. Please try again." },
            { status: 500 },
        );
    }
}
