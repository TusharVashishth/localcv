/* ****** Minimal Resume Template ****** */

import type { ResumeSectionKey, ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";
import { StandardTemplate } from "./standard-template";

export function MinimalTemplate({
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
        pageClassName: "font-sans",
        headerClassName: "pb-2 border-b border-border space-y-1",
        headingClassName:
          "text-xs uppercase tracking-[0.12em] font-medium text-muted-foreground",
        twoColumn: false,
        dense: true,
      }}
    />
  );
}
