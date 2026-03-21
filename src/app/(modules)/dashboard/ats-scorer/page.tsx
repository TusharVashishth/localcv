import { ATSScorerClient } from "@/components/features/ats-scorer/components/ats-scorer-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "ATS Score Checker",
  description:
    "Check your resume's ATS compatibility score against any job description. Get detailed keyword analysis, score breakdown, and AI-powered improvement suggestions.",
  path: "/dashboard/ats-scorer",
  keywords: [
    "ATS score",
    "resume checker",
    "ATS compatibility",
    "job description",
    "resume analysis",
    "keyword match",
  ],
});

export default function ATSScorerPage() {
  return <ATSScorerClient />;
}
