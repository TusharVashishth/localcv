import { Agent } from "@mastra/core/agent";
import { NextResponse } from "next/server";
import { z } from "zod";
import { profileSchema } from "@/components/features/profile/schema/profile-schema";
import type { ExtractedCvData } from "@/lib/cv-extraction";
import { extractCvDataFromPdfDataUrl } from "@/lib/cv-extraction";

const parseCvSchema = z.object({
    provider: z.string().trim().min(1),
    modelName: z.string().trim().min(1),
    apiKey: z.string().trim().min(8),
    fileName: z.string().trim().min(1),
    fileDataUrl: z.string().trim().startsWith("data:application/pdf;base64,"),
});

function composeSummaryFromExtracted(extracted: ExtractedCvData): string {
    if (extracted.summary?.trim()) return extracted.summary;

    const primaryRole = extracted.experience[0]?.role;
    const topSkills = extracted.skills.slice(0, 5).join(", ");
    const fragments = [
        primaryRole ? `Experienced ${primaryRole}.` : "Experienced professional.",
        topSkills ? `Core skills include ${topSkills}.` : "",
    ].filter(Boolean);

    const summary = fragments.join(" ").trim();
    return summary.length >= 10
        ? summary
        : "Experienced professional with a strong track record of delivering reliable software solutions.";
}

function mergeWithExtracted(
    candidate: unknown,
    extracted: ExtractedCvData,
) {
    const parsedCandidate =
        candidate && typeof candidate === "object"
            ? (candidate as Record<string, unknown>)
            : {};

    const profileCandidate =
        parsedCandidate.profile && typeof parsedCandidate.profile === "object"
            ? (parsedCandidate.profile as Record<string, unknown>)
            : {};

    return {
        profile: {
            fullName:
                (typeof profileCandidate.fullName === "string" && profileCandidate.fullName.trim()) ||
                extracted.profile.fullName ||
                "Candidate",
            email:
                (typeof profileCandidate.email === "string" && profileCandidate.email.trim()) ||
                extracted.profile.email,
            phone:
                (typeof profileCandidate.phone === "string" && profileCandidate.phone.trim()) ||
                extracted.profile.phone ||
                "Not provided",
            location:
                (typeof profileCandidate.location === "string" && profileCandidate.location.trim()) ||
                extracted.profile.location ||
                "Not specified",
            website:
                (typeof profileCandidate.website === "string" && profileCandidate.website.trim()) ||
                extracted.profile.website,
            linkedin:
                (typeof profileCandidate.linkedin === "string" && profileCandidate.linkedin.trim()) ||
                extracted.profile.linkedin,
            github:
                (typeof profileCandidate.github === "string" && profileCandidate.github.trim()) ||
                extracted.profile.github,
        },
        summary:
            (typeof parsedCandidate.summary === "string" && parsedCandidate.summary.trim()) ||
            composeSummaryFromExtracted(extracted),
        experience:
            Array.isArray(parsedCandidate.experience) && parsedCandidate.experience.length > 0
                ? parsedCandidate.experience
                : extracted.experience,
        education:
            Array.isArray(parsedCandidate.education) && parsedCandidate.education.length > 0
                ? parsedCandidate.education
                : extracted.education.length > 0
                    ? extracted.education
                    : [
                        {
                            institution: "Not specified",
                            degree: "Not specified",
                            field: "Not specified",
                            startDate: "Not specified",
                            endDate: "Not specified",
                        },
                    ],
        skills:
            Array.isArray(parsedCandidate.skills) && parsedCandidate.skills.length > 0
                ? parsedCandidate.skills
                : extracted.skills.length > 0
                    ? extracted.skills
                    : ["Communication"],
        projects:
            Array.isArray(parsedCandidate.projects)
                ? parsedCandidate.projects
                : extracted.projects,
        certifications:
            Array.isArray(parsedCandidate.certifications)
                ? parsedCandidate.certifications
                : extracted.certifications,
        languages:
            Array.isArray(parsedCandidate.languages)
                ? parsedCandidate.languages
                : extracted.languages,
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = parseCvSchema.safeParse(body);

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

        const { provider, modelName, apiKey, fileDataUrl } = parsed.data;
        const { rawText: extractedText, extracted: extractedHeuristic } =
            await extractCvDataFromPdfDataUrl(fileDataUrl);

        if (!extractedText) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to extract text from this PDF.",
                },
                { status: 400 },
            );
        }

        const parsingAgent = new Agent({
            id: "profile-cv-parser",
            name: "Profile CV Parser",
            instructions:
                "Extract structured resume details from the provided resume text. Return accurate data only.",
            model: {
                id: `${provider}/${modelName}`,
                apiKey,
            },
        });

        const result = await parsingAgent.generate(
            `Extract resume details from the CV text and return strict JSON matching the schema. Use the heuristic extraction as high-confidence hints and complete missing fields from resume content.\n\nHeuristic Extraction (JSON):\n${JSON.stringify(extractedHeuristic, null, 2)}\n\nResume Text:\n${extractedText.slice(0, 30000)}`,
            {
                structuredOutput: {
                    schema: profileSchema,
                },
                modelSettings: {
                    maxOutputTokens: 2500,
                },
            },
        );

        const mergedProfileCandidate = mergeWithExtracted(
            result.object,
            extractedHeuristic,
        );
        const validated = profileSchema.safeParse(mergedProfileCandidate);
        if (!validated.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Parsed CV data failed validation.",
                    extracted: extractedHeuristic,
                },
                { status: 400 },
            );
        }

        return NextResponse.json({
            success: true,
            profile: validated.data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "Unable to parse CV.",
            },
            { status: 400 },
        );
    }
}
