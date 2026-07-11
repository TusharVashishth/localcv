"use client";

/* ****** Template Selector with Thumbnail Previews — 2026 Redesign ****** */

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import {
  getTemplatePreviewStyleConfig,
  TEMPLATE_PREVIEW_DATA,
} from "@/components/features/resume-templates";
import type {
  ResumeTemplate,
  ResumeTemplateData,
} from "@/components/features/resume-templates";
import type { ResumeStyleConfig } from "@/components/features/resume-templates/types";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  templates: ResumeTemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
  styleConfig: ResumeStyleConfig;
  previewData?: ResumeTemplateData;
  layout?: "stack" | "grid";
  /** Override scale for the inner A4 preview */
  previewScale?: number;
  className?: string;
}

export function TemplateSelector({
  templates,
  selectedId,
  onSelect,
  styleConfig,
  previewData,
  layout = "stack",
  previewScale,
  className,
}: TemplateSelectorProps) {
  const data = previewData ?? TEMPLATE_PREVIEW_DATA;
  const isGrid = layout === "grid";

  /*
   * A4 is 794 × 1123 px.
   * Grid runs max-w-4xl (896px) / 3 cols / gap-4 → each column ≈ 288px.
   * scale = 288 / 794 ≈ 0.363  →  visual width fills the column exactly.
   * The preview box uses aspect-ratio: 794/1123 so the FULL resume is always visible.
   */
  const scale = previewScale ?? (isGrid ? 0.363 : 0.22);

  return (
    /* ****** Responsive grid: 1-col mobile → 2-col tablet → 3-col desktop ****** */
    <div
      className={cn(
        isGrid
          ? "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
          : "flex flex-col gap-3 overflow-x-hidden",
        className,
      )}
    >
      {templates.map((template, idx) => {
        const isSelected = template.id === selectedId;
        const TemplateComponent = template.component;

        /* ****** Per-template accent color override for thumbnail ****** */
        const thumbStyleConfig = getTemplatePreviewStyleConfig(template, styleConfig);

        return (
          <motion.button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.04, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            aria-pressed={isSelected}
            className={cn(
              "group relative w-full rounded-[2.25rem] text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "p-6 pb-5 flex flex-col bg-slate-100/50 dark:bg-slate-900/40 border",
              isSelected
                ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)),0_12px_36px_-8px_hsl(var(--primary)/0.18)]"
                : "border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]",
            )}
          >
            {/* ****** Preview thumbnail — full A4 aspect ratio, complete resume visible ****** */}
            <div
              className={cn(
                "relative overflow-hidden rounded-[1.25rem] bg-white @container shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08),0_4px_12px_-8px_rgba(0,0,0,0.04)] transition-all duration-300 w-full",
                isSelected
                  ? "border border-primary/20"
                  : "border border-slate-100 dark:border-slate-800/80",
              )}
              style={{ aspectRatio: "794 / 1123", containerType: "inline-size" }}
            >
              {/* ****** Scaled A4 resume — origin top-left fills card column width dynamically ****** */}
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{
                    width: "794px",
                    height: "1123px",
                    transform: "scale(calc(100cqw / 794px))"
                  }}
                >
                  <TemplateComponent
                    data={data}
                    compact={false}
                    styleConfig={thumbStyleConfig}
                  />
                </div>
              </div>

              {/* ****** Selected check badge ****** */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.18, ease: "backOut" }}
                    className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 z-10"
                  >
                    <Check className="size-4 text-primary-foreground" strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ****** Card footer ****** */}
            <div className="mt-5 flex items-center justify-between gap-3 px-1 w-full">
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[1.1rem] font-semibold leading-tight truncate transition-colors",
                    isSelected ? "text-primary" : "text-slate-800 dark:text-slate-200",
                  )}
                >
                  {template.name}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 rounded-full border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-0.5 shadow-sm">
                <span className="flex size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ATS
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
