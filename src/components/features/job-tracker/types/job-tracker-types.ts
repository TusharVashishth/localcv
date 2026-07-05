import type { JobApplication, JobApplicationStatus } from "@/lib/db/schema";

export type { JobApplication, JobApplicationStatus };

export interface JobApplicationWithResume extends JobApplication {
  companyResume?: {
    id: number;
    companyName: string;
    createdAt: Date;
    hasCoverLetter: boolean;
  };
}

export const JOB_STATUSES: JobApplicationStatus[] = [
  "saved",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn"
];

export const STATUS_LABELS: Record<JobApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};
