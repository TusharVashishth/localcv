import { z } from "zod";

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
    skills: z.array(z.string()),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        highlights: z.array(z.string()),
        technologies: z.array(z.string()),
        link: z.string().optional(),
    })),
});

export const generateCoverLetterSchema = z.object({
    companyName: z.string().trim().min(1, "Company name is required"),
    jobDescription: z.string().trim().min(50, "Job description must be at least 50 characters"),
    profileData: profileDataSchema,
    config: configSchema,
});