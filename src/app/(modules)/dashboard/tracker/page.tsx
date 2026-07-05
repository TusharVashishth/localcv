import { JobTrackerClient } from "@/components/features/job-tracker/components/job-tracker-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Job Applications Tracker",
  description:
    "Track your job applications, organise interviews, and link tailored resumes in a secure, local-first dashboard.",
  path: "/dashboard/tracker",
  keywords: [
    "job tracker",
    "application tracking",
    "job search",
    "kanban pipeline",
  ],
});

export default function JobTrackerPage() {
  return <JobTrackerClient />;
}
