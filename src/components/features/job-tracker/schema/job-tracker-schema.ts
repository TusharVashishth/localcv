import { z } from "zod";

export const jobApplicationFormSchema = z
  .object({
    companyName: z.string().trim().min(1, "Company name is required"),
    role: z.string().trim().min(1, "Job title/role is required"),
    jobUrl: z
      .string()
      .trim()
      .url("Must be a valid URL")
      .or(z.literal(""))
      .optional(),
    jobDescription: z.string().optional(),
    status: z.enum([
      "saved",
      "applied",
      "screening",
      "interview",
      "offer",
      "rejected",
      "withdrawn",
    ]),
    applicationDate: z.string().min(1, "Application date is required"),
    followUpDate: z.string().optional(),
    notes: z.string().optional(),
    salaryMin: z.preprocess(
      (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
      z.number().min(0, "Must be a positive number").optional()
    ),
    salaryMax: z.preprocess(
      (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
      z.number().min(0, "Must be a positive number").optional()
    ),
    currency: z.string().optional().default("USD"),
    companyResumeId: z.number().optional(),
    recruiterName: z.string().optional(),
    recruiterEmail: z
      .string()
      .trim()
      .email("Must be a valid email")
      .or(z.literal(""))
      .optional(),
    source: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["salaryMax"],
    }
  );

export type JobApplicationFormValues = z.infer<typeof jobApplicationFormSchema>;
