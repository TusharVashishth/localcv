import { CompanyResumeBuilderClient } from "@/components/features/company-resume/components/company-resume-builder-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Build Company Resume",
  description:
    "Build and customise your AI-tailored company-specific resume with full template and style controls.",
  path: "/dashboard/company-resumes",
  keywords: ["company resume builder", "tailored resume", "resume template"],
});

interface CompanyResumeBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyResumeBuilderPage({
  params,
}: CompanyResumeBuilderPageProps) {
  const { id } = await params;
  return <CompanyResumeBuilderClient id={Number(id)} />;
}
