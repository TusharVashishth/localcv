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

/* ****** Structured output schema for ATS score analysis ****** */
export const atsScoreOutputSchema = z.object({
    score: z.number().min(0).max(100),
    scoreBreakdown: z.object({
        keywordMatch: z.number().min(0).max(100),
        experienceRelevance: z.number().min(0).max(100),
        skillsMatch: z.number().min(0).max(100),
        formatQuality: z.number().min(0).max(100),
    }),
    matchedKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    sectionFeedback: z.object({
        summary: z.string(),
        experience: z.string(),
        skills: z.string(),
        education: z.string(),
    }),
});

export type ATSScoreOutput = z.infer<typeof atsScoreOutputSchema>;

export const atsScorerAgent = new Agent({
    id: "ats-scorer-agent",
    name: "ATS Scorer Agent",
    instructions: `You are an expert ATS (Applicant Tracking System) resume analyst. Given a candidate's resume profile and a job description, you score how well the resume matches the job from an ATS perspective.

SCORING RULES:
- Overall score (0-100): weighted average of the four sub-scores
- keywordMatch (0-100): how many important JD keywords/phrases appear in the resume
- experienceRelevance (0-100): how relevant the candidate's work history is to the role requirements
- skillsMatch (0-100): how well the listed skills align with the required and preferred skills in the JD
- formatQuality (0-100): clarity of structure, use of action verbs, quantified achievements, no spelling issues

KEYWORD ANALYSIS:
- matchedKeywords: important terms from the JD that ARE present in the resume
- missingKeywords: important terms from the JD that are NOT present in the resume (focus on role-specific skills, technologies, certifications)

FEEDBACK:
- strengths: 3-5 specific things the candidate does well relative to this JD
- improvements: 3-6 specific, actionable suggestions to improve ATS compatibility
- sectionFeedback: brief paragraph per section (summary, experience, skills, education) explaining what is good and what can be improved

Be honest, specific, and constructive. Return complete JSON matching the requested schema — do not omit any fields.`,
    model: getRuntimeModel,
});
