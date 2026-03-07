/* ****** Technical Resume Template ****** */

import type { ResumeSectionKey, ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";
import { StandardTemplate } from "./standard-template";

export function TechnicalTemplate({
  data,
  compact,
  styleConfig,
  sectionOrder,
}: {
  data: ResumeTemplateData;
  compact?: boolean;
  styleConfig?: ResumeStyleConfig;
  sectionOrder?: ResumeSectionKey[];
}) {
  return (
    <StandardTemplate
      data={data}
      compact={compact}
      styleConfig={styleConfig}
      sectionOrder={sectionOrder}
      variant={{
        pageClassName: "font-mono",
        headerClassName: "pb-3 border-b border-border space-y-1",
        headingClassName: "text-xs font-semibold uppercase tracking-wide",
        twoColumn: true,
        dense: true,
      }}
    />
  );
}
