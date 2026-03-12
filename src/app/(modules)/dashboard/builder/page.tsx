import { BuilderClient } from "@/components/features/builder/components/builder-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Resume Builder",
  description:
    "Write and refine resume sections with live preview, template switching, and export-ready formatting in localCV.",
  path: "/dashboard/builder",
  keywords: ["resume editor", "live resume preview", "resume export"],
});

export default function ResumeBuilderPage() {
  return <BuilderClient />;
}
