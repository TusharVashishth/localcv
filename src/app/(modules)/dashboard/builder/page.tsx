import { BuilderClient } from "@/components/features/builder/components/builder-client";
import { buildPageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = buildPageMetadata({
  title: "Resume Builder",
  description:
    "Write and refine resume sections with live preview, template switching, and export-ready formatting in localCV.",
  path: "/dashboard/builder",
  keywords: ["resume editor", "live resume preview", "resume export"],
});

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading builder...</p>
        </div>
      </div>
    }>
      <BuilderClient />
    </Suspense>
  );
}
