"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  getTemplatePreviewStyleConfig,
  RESUME_TEMPLATES,
  TEMPLATE_PREVIEW_DATA,
} from "@/components/features/resume-templates";
import { DEFAULT_STYLE_CONFIG } from "@/components/features/resume-templates/types";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

function TemplatePage({
  template,
}: {
  template: (typeof RESUME_TEMPLATES)[number];
}) {
  const router = useRouter();
  const TemplateComponent = template.component;
  const styleConfig = getTemplatePreviewStyleConfig(
    template,
    DEFAULT_STYLE_CONFIG,
  );
  const previewStyleConfig = {
    ...styleConfig,
    fontSize: "large" as const,
  };

  const handleNavigate = () => router.push("/dashboard/builder");

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      className="flex justify-center"
    >
      <div
        onClick={handleNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate();
          }
        }}
        role="button"
        tabIndex={0}
        className={cn(
          "group relative block shrink-0 cursor-pointer rounded-[2.25rem] text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "p-6 pb-5 flex flex-col bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]",
          "w-84 sm:w-88"
        )}
        aria-label={`Open ${template.name} template in builder`}
      >
        {/* ****** Preview thumbnail — full A4 aspect ratio, complete resume visible ****** */}
        <div
          className="relative overflow-hidden rounded-[1.25rem] bg-white @container shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08),0_4px_12px_-8px_rgba(0,0,0,0.04)] transition-all duration-300 w-full border border-slate-100 dark:border-slate-800/80"
          style={{ aspectRatio: "794 / 1123", containerType: "inline-size" }}
        >
          {/* ****** Scaled A4 resume — origin top-left fills card column width dynamically ****** */}
          <div className="pointer-events-none absolute inset-0" aria-hidden inert>
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: "794px",
                height: "1123px",
                transform: "scale(calc(100cqw / 794px))",
              }}
            >
              <TemplateComponent
                data={TEMPLATE_PREVIEW_DATA}
                styleConfig={previewStyleConfig}
              />
            </div>
          </div>
        </div>

        {/* ****** Card footer ****** */}
        <div className="mt-5 flex items-center justify-between gap-3 px-1 w-full">
          <div className="min-w-0">
            <p className="text-[1.1rem] font-semibold leading-tight truncate text-slate-800 dark:text-slate-200 transition-colors group-hover:text-primary">
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
      </div>
    </motion.div>
  );
}

export function TemplatesSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/70 bg-background py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_36%),linear-gradient(180deg,rgba(240,253,250,0.92),rgba(255,255,255,0.98)_32%,rgba(248,250,252,0.96))] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(3,7,18,0.98)_34%,rgba(2,6,23,1))]" />
      <div
        className="absolute inset-0 opacity-50 dark:opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            Professional Templates
          </h2>
        </motion.div>

        <div className="relative -mx-6 md:-mx-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background via-background/80 to-transparent" />

          <Marquee
            pauseOnHover
            repeat={2}
            className="[--duration:40s] [--gap:1.5rem] px-6 md:px-10"
          >
            {RESUME_TEMPLATES.map((template) => (
              <TemplatePage
                key={template.id}
                template={template}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
