/* ****** Modern Resume Template ****** */

import type { ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";
import { StandardTemplate } from "./standard-template";

export function ModernTemplate({
  data,
  compact,
  styleConfig,
}: {
  data: ResumeTemplateData;
  compact?: boolean;
  styleConfig?: ResumeStyleConfig;
}) {
  return (
    <StandardTemplate
      data={data}
      compact={compact}
      styleConfig={styleConfig}
      variant={{
        pageClassName: "font-sans",
        headerClassName: "pb-3 border-b border-border space-y-1",
        headingClassName: "text-xs font-semibold uppercase tracking-wide",
        twoColumn: true,
        dense: false,
      }}
    />
  );
}
