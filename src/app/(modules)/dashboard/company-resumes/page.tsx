import { CompanyResumesClient } from "@/components/features/company-resume/components/company-resumes-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Company Resumes",
  description:
    "Create AI-tailored resumes for specific companies and job descriptions. Let localCV tailor your profile to match any role.",
  path: "/dashboard/company-resumes",
  keywords: [
    "company resume",
    "tailored resume",
    "job description",
    "ATS resume",
  ],
});

export default function CompanyResumesPage() {
  return <CompanyResumesClient />;
}
