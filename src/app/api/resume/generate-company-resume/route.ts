import { RequestContext } from "@mastra/core/request-context";
import { NextResponse } from "next/server";
import { z } from "zod";
import { jdTailorAgent, jdTailorOutputSchema } from "@/mastra/agents/jd-tailor-agent";

/* ****** Request validation schema ****** */
const configSchema = z.object({
    provider: z.string().trim().min(1),
    modelName: z.string().trim().min(1),
    apiKey: z.string().trim().min(8),
});

const profileDataSchema = z.object({
    profile: z.object({
        fullName: z.string(),
        email: z.string(),
        phone: z.string(),
        location: z.string(),
        website: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        photo: z.string().optional(),
    }),
    summary: z.string(),
    experience: z.array(z.object({
        company: z.string(),
        role: z.string(),
        location: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string().optional(),
        achievements: z.array(z.string()),
    })),
    education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        field: z.string(),
        startDate: z.string(),
        endDate: z.string(),
    })),
    skills: z.array(z.string()),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        highlights: z.array(z.string()),
        technologies: z.array(z.string()),
        link: z.string().optional(),
    })),
    certifications: z.array(z.object({
        name: z.string(),
        issuer: z.string(),
        issueDate: z.string(),
        credentialId: z.string().optional(),
    })),
    languages: z.array(z.object({
        name: z.string(),
        proficiency: z.string(),
    })),
});

const generateCompanyResumeSchema = z.object({
    companyName: z.string().trim().min(1, "Company name is required"),
    jobDescription: z.string().trim().min(50, "Job description must be at least 50 characters"),
    profileData: profileDataSchema,
    config: configSchema,
});

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
