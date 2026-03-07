/* ****** Resume Section Order Utilities ****** */

import type { ResumeTemplateData } from "./index";

export const RESUME_SECTION_KEYS = [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
] as const;

export type ResumeSectionKey = (typeof RESUME_SECTION_KEYS)[number];

export const RESUME_SECTION_LABELS: Record<ResumeSectionKey, string> = {
    summary: "Professional Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
};

const SECTION_DEFAULT_ORDER: ResumeSectionKey[] = [...RESUME_SECTION_KEYS];

export function getTemplateDefaultSectionOrder(
    templateId: string,
): ResumeSectionKey[] {
    const byTemplate: Record<string, ResumeSectionKey[]> = {
        classic: [...SECTION_DEFAULT_ORDER],
        modern: [...SECTION_DEFAULT_ORDER],
        minimal: [...SECTION_DEFAULT_ORDER],
        executive: [...SECTION_DEFAULT_ORDER],
        technical: [...SECTION_DEFAULT_ORDER],
        "sidebar-color": [
            "summary",
            "experience",
            "education",
            "projects",
            "skills",
            "languages",
            "certifications",
        ],
        photo: [
            "summary",
            "experience",
            "projects",
            "education",
            "skills",
            "certifications",
            "languages",
        ],
        creative: [
            "summary",
            "experience",
            "projects",
            "skills",
            "education",
            "certifications",
            "languages",
        ],
    };

    return [...(byTemplate[templateId] ?? SECTION_DEFAULT_ORDER)];
}

function hasSectionData(data: ResumeTemplateData, section: ResumeSectionKey): boolean {
    switch (section) {
        case "summary":
            return Boolean(data.summary?.trim());
        case "experience":
            return data.experience.length > 0;
        case "education":
            return data.education.length > 0;
        case "skills":
            return data.skills.length > 0;
        case "projects":
            return data.projects.length > 0;
        case "certifications":
            return data.certifications.length > 0;
        case "languages":
            return data.languages.length > 0;
        default:
            return false;
    }
}

export function resolveSectionOrder(
    requestedOrder: readonly string[] | undefined,
): ResumeSectionKey[] {
    const deduped: ResumeSectionKey[] = [];
    for (const key of requestedOrder ?? []) {
        if (!RESUME_SECTION_KEYS.includes(key as ResumeSectionKey)) continue;
        const typedKey = key as ResumeSectionKey;
        if (deduped.includes(typedKey)) continue;
        deduped.push(typedKey);
    }

    for (const fallback of SECTION_DEFAULT_ORDER) {
        if (!deduped.includes(fallback)) {
            deduped.push(fallback);
        }
    }

    return deduped;
}

export function getRenderableSectionOrder(
    data: ResumeTemplateData,
    requestedOrder: readonly string[] | undefined,
): ResumeSectionKey[] {
    return resolveSectionOrder(requestedOrder).filter((section) =>
        hasSectionData(data, section),
    );
}

export function moveSectionItem(
    order: ResumeSectionKey[],
    fromIndex: number,
    toIndex: number,
): ResumeSectionKey[] {
    if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= order.length ||
        toIndex >= order.length ||
        fromIndex === toIndex
    ) {
        return order;
    }

    const next = [...order];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
}
