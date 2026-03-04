/* ****** Minimal Resume Template ****** */

import type { ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";
import { StandardTemplate } from "./standard-template";

export function MinimalTemplate({
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
        headerClassName: "pb-2 border-b border-border space-y-1",
        headingClassName:
          "text-xs uppercase tracking-[0.12em] font-medium text-muted-foreground",
        twoColumn: false,
        dense: true,
      }}
    />
  );
}
