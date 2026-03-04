/* ****** Executive Resume Template ****** */

import type { ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";
import { StandardTemplate } from "./standard-template";

export function ExecutiveTemplate({
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
        pageClassName: "font-serif",
        headerClassName: "pb-4 border-b-2 border-border text-center space-y-1",
        headingClassName: "text-xs font-semibold uppercase tracking-[0.16em]",
        twoColumn: true,
        dense: false,
      }}
    />
  );
}
