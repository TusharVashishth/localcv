"use client";

/* ****** Resume Preview Panel ****** */

import type {
  ResumeTemplate,
  ResumeTemplateData,
  ResumeSectionKey,
} from "@/components/features/resume-templates";
import type { ResumeStyleConfig } from "@/components/features/resume-templates/types";

export const PREVIEW_ELEMENT_ID = "resume-preview-content";

interface ResumePreviewProps {
  template: ResumeTemplate;
  data: ResumeTemplateData;
  styleConfig: ResumeStyleConfig;
  sectionOrder?: ResumeSectionKey[];
}

export function ResumePreview({
  template,
  data,
  styleConfig,
  sectionOrder,
}: ResumePreviewProps) {
  const TemplateComponent = template.component;

  /* ****** Merge per-template default accent color with user override ****** */
  const resolvedConfig: ResumeStyleConfig = {
    ...styleConfig,
    accentColor:
      styleConfig.accentColor ?? template.defaultAccentColor ?? "#0f4c81",
  };

  return (
    <div className="rounded-md border bg-background overflow-auto">
      {/* ****** Wrapper targeted by PDF export ****** */}
      <div id={PREVIEW_ELEMENT_ID}>
        <TemplateComponent
          data={data}
          styleConfig={resolvedConfig}
          sectionOrder={sectionOrder}
        />
      </div>
    </div>
  );
}
