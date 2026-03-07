/* ****** Classic Resume Template ****** */

import type { ResumeSectionKey, ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";
import { StandardTemplate } from "./standard-template";

export function ClassicTemplate({
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
        pageClassName: "font-serif",
        headerClassName: "pb-3 border-b border-border text-center space-y-1",
        headingClassName:
          "text-xs uppercase tracking-wide font-semibold border-b border-border pb-1",
        twoColumn: false,
        dense: false,
      }}
    />
  );
}
