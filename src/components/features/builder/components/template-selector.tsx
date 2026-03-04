"use client";

/* ****** Template Selector with Thumbnail Previews ****** */

import type {
  ResumeTemplate,
  ResumeTemplateData,
} from "@/components/features/resume-templates";
import type { ResumeStyleConfig } from "@/components/features/resume-templates/types";
import { TEMPLATE_PREVIEW_DATA } from "@/components/features/resume-templates";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  templates: ResumeTemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
  styleConfig: ResumeStyleConfig;
  previewData?: ResumeTemplateData;
}

export function TemplateSelector({
  templates,
  selectedId,
  onSelect,
  styleConfig,
  previewData,
}: TemplateSelectorProps) {
  const data = previewData ?? TEMPLATE_PREVIEW_DATA;

  return (
    /* ****** Mobile: horizontal scroll; Desktop (inside sidebar): vertical stack ****** */
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x lg:flex-col lg:overflow-x-visible lg:gap-0 lg:space-y-3 lg:pb-0">
      {templates.map((template) => {
        const isSelected = template.id === selectedId;
        const TemplateComponent = template.component;

        /* ****** Per-template accent color override for thumbnail ****** */
        const thumbStyleConfig: ResumeStyleConfig = {
          ...styleConfig,
          accentColor: template.defaultAccentColor ?? styleConfig.accentColor,
          sidebarColor: template.defaultAccentColor ?? styleConfig.accentColor,
        };

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              /* mobile: fixed width card; desktop: full width */
              "shrink-0 w-40 snap-start rounded-lg border-2 overflow-hidden text-left transition-all hover:shadow-md lg:w-full lg:shrink",
              isSelected
                ? "border-primary shadow-md ring-2 ring-primary/20"
                : "border-border hover:border-muted-foreground/40",
            )}
          >
            {/* Thumbnail preview — scaled down via transform */}
            <div
              className="relative w-full overflow-hidden bg-background"
              style={{ height: "120px" }}
            >
              <div
                className="absolute top-0 left-0 origin-top-left pointer-events-none"
                style={{ width: "800px", transform: "scale(0.23)" }}
              >
                <TemplateComponent
                  data={data}
                  compact={false}
                  styleConfig={thumbStyleConfig}
                />
              </div>
              {/* Overlay gradient so text bleeds gently */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/60 pointer-events-none" />
            </div>

            {/* Label below thumbnail */}
            <div
              className={cn(
                "px-2 py-1.5 border-t",
                isSelected ? "bg-primary/5 border-primary/20" : "bg-muted/30",
              )}
            >
              <p className="text-xs font-semibold leading-none">
                {template.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 hidden lg:block">
                {template.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
