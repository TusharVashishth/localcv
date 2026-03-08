import { Agent } from "@mastra/core/agent";

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

export const profileSummaryAgent = new Agent({
    id: "profile-summary-agent",
    name: "Profile Summary Agent",
    instructions: `You refine resume profile summaries for ATS readability and human impact.

OUTPUT RULES:
- Return only a single paragraph.
- Keep it between 3-5 concise sentences.
- Preserve factual details from input; do not invent claims.
- Highlight measurable impact, strengths, and role fit when present.
- Use professional language and avoid buzzword stuffing.
`,
    model: getRuntimeModel,
});

export const experienceRefineAgent = new Agent({
    id: "experience-refine-agent",
    name: "Experience Refine Agent",
    instructions: `You refine resume work experience entries for clarity, impact, and ATS keyword relevance.

OUTPUT RULES:
- Keep all content truthful to provided input.
- Improve wording of descriptions and achievements.
- Prefer active voice and measurable outcomes when available.
- Do not add new employers, dates, or technologies not in input.
- Keep achievements concise and resume-ready.
`,
    model: getRuntimeModel,
});

export const projectRefineAgent = new Agent({
    id: "project-refine-agent",
    name: "Project Refine Agent",
    instructions: `You refine resume project entries to be concise, impact-oriented, and ATS-friendly.

OUTPUT RULES:
- Keep content factual and grounded in input.
- Improve project descriptions and highlight business/technical impact.
- Keep highlights scannable and outcome-focused.
- Normalize technologies wording without inventing new tools.
- Do not change links unless provided in input.
`,
    model: getRuntimeModel,
});
