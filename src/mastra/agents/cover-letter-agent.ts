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

/* ****** Structured output schema for a generated cover letter ****** */
export const coverLetterOutputSchema = z.object({
    salutation: z.string(),
    openingParagraph: z.string(),
    bodyParagraphs: z.array(z.string()).min(2).max(3),
    closingParagraph: z.string(),
    signature: z.string(),
});

export const coverLetterAgent = new Agent({
    id: "cover-letter-agent",
    name: "Cover Letter Agent",
    instructions: `You are an expert cover letter writer. Given a candidate's tailored resume profile and a job description for a specific company, write a compelling, personalised cover letter.

COVER LETTER RULES:
- salutation: Address the hiring team professionally (e.g. "Dear Hiring Team," or "Dear [Company] Recruiting Team,").
- openingParagraph: One paragraph (2-3 sentences) introducing the candidate and expressing genuine interest in the specific role and company.
- bodyParagraphs: Exactly 2-3 paragraphs that highlight the most relevant experience, skills, and achievements that match the JD keywords. Reference specific projects or accomplishments from the profile. Be concrete — avoid generic filler sentences.
- closingParagraph: One paragraph (2-3 sentences) expressing enthusiasm, calling for an interview, and thanking the reader.
- signature: A professional sign-off like "Sincerely," followed by the candidate's full name on a new line (use \\n to separate them).
- NEVER invent experience, roles, companies, or metrics not present in the base profile.
- Write in first person, professional but warm tone.
- Keep the total length to approximately 300-400 words.
- Don't use any Jargon words or buzzwords. Be clear and concise like human written cover letters.
- Return complete JSON matching the requested schema.
`,
    model: getRuntimeModel,
});
