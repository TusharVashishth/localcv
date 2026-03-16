import { z } from "zod";

export const createCompanyResumeSchema = z.object({
    companyName: z
        .string()
        .trim()
        .min(1, "Company name is required")
        .max(100, "Company name must be 100 characters or less"),
    jobDescription: z
        .string()
        .trim()
        .min(50, "Job description must be at least 50 characters"),
});

export type CreateCompanyResumeFormValues = z.infer<typeof createCompanyResumeSchema>;
