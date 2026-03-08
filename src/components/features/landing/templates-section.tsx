"use client";

import {
  RESUME_TEMPLATES,
  TEMPLATE_PREVIEW_DATA,
} from "@/components/features/resume-templates";
import type { ResumeStyleConfig } from "@/components/features/resume-templates/types";
import { DEFAULT_STYLE_CONFIG } from "@/components/features/resume-templates/types";
import { buttonVariants } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const templateRows = [RESUME_TEMPLATES.slice(0, 4), RESUME_TEMPLATES.slice(4)];

function TemplateCard({
  template,
  priority,
}: {
  template: (typeof RESUME_TEMPLATES)[number];
  priority: boolean;
}) {
  const TemplateComponent = template.component;
  const styleConfig: ResumeStyleConfig = {
    ...DEFAULT_STYLE_CONFIG,
    accentColor:
      template.defaultAccentColor ?? DEFAULT_STYLE_CONFIG.accentColor,
    sidebarColor:
      template.defaultAccentColor ?? DEFAULT_STYLE_CONFIG.accentColor,
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="group flex shrink-0 flex-col"
    >
      <article className="flex w-77.5 flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/95 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] transition-colors duration-300 hover:border-primary/45 dark:bg-card/95">
        <div className="relative h-57.5 overflow-hidden bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(255,255,255,0))] p-3 dark:bg-[linear-gradient(180deg,rgba(16,185,129,0.18),rgba(0,0,0,0))]">
          <div className="pointer-events-none h-full overflow-hidden rounded-2xl border border-border/60 bg-muted/35 shadow-inner transition-transform duration-500 group-hover:scale-[1.02]">
            <TemplateComponent
              data={TEMPLATE_PREVIEW_DATA}
              compact
              styleConfig={styleConfig}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-3 bottom-3 h-16 rounded-b-2xl bg-linear-to-b from-transparent to-background/78 dark:to-background/88" />
        </div>
        <div className="border-t border-border/60 px-5 py-4 transition-colors duration-300 group-hover:bg-muted/40">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold tracking-tight">
              {template.name}
            </p>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
              ATS
            </span>
          </div>
          <p className="mt-2 min-h-10 text-sm leading-6 text-muted-foreground">
            {template.description}
          </p>
          <Link
            href="/dashboard/builder"
            prefetch={priority}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-75"
          >
            Use this template
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </article>
    </motion.div>
  );
}

export function TemplatesSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/70 bg-muted/20 py-10">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_58%)]" />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Professional Templates
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Browse bigger live previews in a continuous gallery. Every design
              is ATS-friendly, polished, and ready for fast customization.
            </p>
          </div>
        </motion.div>

        <div className="relative -mx-6 mt-14 space-y-5 md:-mx-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background via-background/80 to-transparent" />

          {templateRows.map((row, rowIndex) => (
            <div key={rowIndex}>
              <Marquee
                pauseOnHover
                reverse={rowIndex % 2 === 1}
                repeat={2}
                className="[--duration:38s] md:[--duration:46s]"
              >
                {row.map((template, index) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    priority={rowIndex === 0 && index === 0}
                  />
                ))}
              </Marquee>
            </div>
          ))}

          <p className="px-6 text-sm text-muted-foreground md:px-10">
            Hover to pause the gallery and inspect each template more closely.
          </p>
        </div>
      </div>
    </section>
  );
}
