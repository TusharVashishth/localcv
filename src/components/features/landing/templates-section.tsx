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

function TemplatePage({
  template,
  priority,
}: {
  template: (typeof RESUME_TEMPLATES)[number];
  priority: boolean;
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
    <motion.div whileHover={{ y: -8 }} className="flex justify-center">
      <article
        onClick={handleNavigate}
        onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
        role="button"
        tabIndex={0}
        className="group block shrink-0 cursor-pointer"
        aria-label={`Open ${template.name} template in builder`}
      >
        <div className="relative w-84 overflow-hidden transition-transform duration-300 sm:w-88">
          <div className="relative aspect-210/297 overflow-hidden border border-slate-200/90 bg-background dark:border-white/12">
            <div
              className="pointer-events-none absolute top-0 left-0 origin-top-left"
              style={{ width: "840px", transform: "scale(0.405)" }}
            >
              <TemplateComponent
                data={TEMPLATE_PREVIEW_DATA}
                styleConfig={previewStyleConfig}
              />
            </div>
          </div>
        </div>
      </article>
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
            repeat={3}
            className="[--duration:40s] [--gap:1.5rem] px-6 md:px-10"
          >
            {RESUME_TEMPLATES.map((template, index) => (
              <TemplatePage
                key={template.id}
                template={template}
                priority={index < 2}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
