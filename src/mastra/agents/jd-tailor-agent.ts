import { Agent } from "@mastra/core/agent";
import { z } from "zod";

function getRuntimeModel({ requestContext }: { requestContext: { get: (key: string) => unknown } }) {
    const provider = String(requestContext.get("provider") ?? "").trim();
    const modelName = String(requestContext.get("modelName") ?? "").trim();
    const apiKey = String(requestContext.get("apiKey") ?? "").trim();
    const modelId = `${provider}/${modelName}` as `${string}/${string}`;

    return {
        id: modelId,
        apiKey,
    };
}

/* ****** Structured output schema for tailored resume sections ****** */
export const jdTailorOutputSchema = z.object({
    summary: z.string(),
    skills: z.array(z.string()),
    experience: z.array(
        z.object({
            company: z.string(),
            role: z.string(),
            location: z.string().optional(),
            startDate: z.string(),
            endDate: z.string(),
            description: z.string().optional(),
            achievements: z.array(z.string()),
        }),
    ),
    projects: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            highlights: z.array(z.string()),
            technologies: z.array(z.string()),
            link: z.string().optional(),
        }),
    ),
    education: z.array(
        z.object({
            institution: z.string(),
            degree: z.string(),
            field: z.string(),
            startDate: z.string(),
            endDate: z.string(),
        }),
    ),
    certifications: z.array(
        z.object({
            name: z.string(),
            issuer: z.string(),
            issueDate: z.string(),
            credentialId: z.string().optional(),
        }),
    ),
    languages: z.array(
        z.object({
            name: z.string(),
            proficiency: z.string(),
        }),
    ),
});

export const jdTailorAgent = new Agent({
    id: "jd-tailor-agent",
    name: "JD Tailor Agent",
    instructions: `You are an expert resume tailoring specialist. Given a candidate's base profile and a job description for a specific company, you rewrite all resume sections to best match the role requirements.

TAILORING RULES:
- Reorder and reword skills to front-load those mentioned in the JD.
- Rewrite the summary to position the candidate for this specific role and company.
- Enhance experience descriptions and achievements to emphasize responsibilities and outcomes that align with the JD keywords.
- Highlight relevant project highlights and technologies that match the JD.
- Keep education, certifications, and languages as-is unless they are directly relevant to the JD, in which case lightly emphasize them.
- NEVER invent new companies, roles, dates, or credentials not present in the base profile.
- NEVER fabricate metrics or claims not grounded in the input.
- Keep all content factual, professional, and ATS-optimized.
- Return complete JSON matching the requested schema — do not omit any fields.
`,
    model: getRuntimeModel,
});
