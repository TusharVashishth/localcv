import { z } from "zod";

const optionalUrl = z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || /^https?:\/\//.test(value), {
        message: "Please enter a valid URL starting with http:// or https://",
    });

const resumeProfileSchema = z.object({
    fullName: z.string().trim().min(2, "Full name is required"),
    email: z.email("Please enter a valid email"),
    phone: z.string().trim().min(8, "Phone number is required"),
    location: z.string().trim().min(2, "Location is required"),
    website: optionalUrl,
    linkedin: optionalUrl,
    github: optionalUrl,
    photo: z.string().optional(),
});

const workExperienceSchema = z.object({
    company: z.string().trim().min(1, "Company is required"),
    role: z.string().trim().min(1, "Role is required"),
    location: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .transform((value) => (value ? value : undefined)),
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: z.string().trim().min(1, "End date is required"),
    description: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .transform((value) => (value ? value : undefined)),
    achievements: z.array(z.string()).default([]),
});

const educationSchema = z.object({
    institution: z.string().trim().min(1, "Institution is required"),
    degree: z.string().trim().min(1, "Degree is required"),
    field: z.string().trim().min(1, "Field is required"),
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: z.string().trim().min(1, "End date is required"),
});

const projectSchema = z.object({
    name: z.string().trim().min(1, "Project name is required"),
    description: z.string().trim().min(1, "Project description is required"),
    highlights: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    link: optionalUrl,
});

const certificationSchema = z.object({
    name: z.string().trim().min(1, "Certification name is required"),
    issuer: z.string().trim().min(1, "Issuer is required"),
    issueDate: z.string().trim().min(1, "Issue date is required"),
    credentialId: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .transform((value) => (value ? value : undefined)),
});

const languageSchema = z.object({
    name: z.string().trim().min(1, "Language name is required"),
    proficiency: z.string().trim().min(1, "Proficiency is required"),
});

export const profileSchema = z.object({
    profile: resumeProfileSchema,
    summary: z.string().trim().min(10, "Summary is required"),
    experience: z.array(workExperienceSchema).min(1, "Add at least one experience"),
    education: z.array(educationSchema).min(1, "Add at least one education entry"),
    skills: z.array(z.string()).min(1, "Add at least one skill"),
    projects: z.array(projectSchema).default([]),
    certifications: z.array(certificationSchema).default([]),
    languages: z.array(languageSchema).default([]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const defaultProfileFormValues: ProfileFormValues = {
    profile: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
        photo: "",
    },
    summary: "",
    experience: [
        {
            company: "",
            role: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            achievements: [],
        },
    ],
    education: [
        {
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
        },
    ],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
};
