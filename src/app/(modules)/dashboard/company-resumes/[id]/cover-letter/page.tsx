import { CoverLetterBuilderClient } from "@/components/features/company-resume/components/cover-letter-builder-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Cover Letter Builder",
  description:
    "Generate and customise an AI-written cover letter tailored to your target company and role.",
  path: "/dashboard/company-resumes",
  keywords: ["cover letter builder", "ai cover letter", "tailored cover letter"],
});

interface CoverLetterPageProps {
  params: Promise<{ id: string }>;
}

export default async function CoverLetterPage({ params }: CoverLetterPageProps) {
  const { id } = await params;
  return <CoverLetterBuilderClient id={Number(id)} />;
}
