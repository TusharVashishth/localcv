import { z } from "zod";

function normalizeListValue(value: string | string[] | undefined) {
    if (!value) return [];
    const raw = Array.isArray(value) ? value.join("\n") : value;

    return raw
        .split(/\r?\n|[,;]+/g)
        .map((entry) => entry.replace(/^[-*\u2022]\s*/, "").trim())
        .filter(Boolean);
}

const listFieldSchema = z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((value) => normalizeListValue(value));


export const experienceItemSchema = z.object({
    company: z.string().trim().min(1),
    role: z.string().trim().min(1),
    location: z.string().optional().or(z.literal("")),
    startDate: z.string().trim().min(1),
    endDate: z.string().trim().min(1),
    description: z.string().optional().or(z.literal("")),
    achievements: z.array(z.string().trim().min(1)).default([]),
});

export const projectItemSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    highlights: z.array(z.string().trim().min(1)).default([]),
    technologies: z.array(z.string().trim().min(1)).default([]),
    link: z.string().optional().or(z.literal("")),
});

export const configSchema = z.object({
    provider: z.string().trim().min(1),
    modelName: z.string().trim().min(1),
    apiKey: z.string().trim().min(8),
});

export const refineSummarySchema = z.object({
    section: z.literal("summary"),
    config: configSchema,
    summary: z.string().trim().min(1),
    skills: z.array(z.string().trim().min(1)).default([]),
});

export const refineExperienceSchema = z.object({
    section: z.literal("experience"),
    config: configSchema,
    experience: z.array(experienceItemSchema).min(1),
});

export const refineProjectsSchema = z.object({
    section: z.literal("projects"),
    config: configSchema,
    projects: z.array(projectItemSchema).min(1),
});

export const refineProfileSectionSchema = z.discriminatedUnion("section", [
    refineSummarySchema,
    refineExperienceSchema,
    refineProjectsSchema,
]);

export const experienceOutputSchema = z.object({
    experience: z.array(
        z.object({
            company: z.string().trim().min(1),
            role: z.string().trim().min(1),
            location: z.string().optional().or(z.literal("")),
            startDate: z.string().trim().min(1),
            endDate: z.string().trim().min(1),
            description: z.string().optional().or(z.literal("")),
            achievements: listFieldSchema,
        }),
    ),
});

export const projectsOutputSchema = z.object({
    projects: z.array(
        z.object({
            name: z.string().trim().min(1),
            description: z.string().trim().min(1),
            highlights: listFieldSchema,
            technologies: listFieldSchema,
            link: z.string().optional().or(z.literal("")),
        }),
    ),
});