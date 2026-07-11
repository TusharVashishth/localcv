"use client";

import { useRouter } from "next/navigation";
import { Sparkles, FileText, CheckCircle2, ChevronRight, Wand2 } from "lucide-react";
import {
  RESUME_TEMPLATES,
  DEFAULT_STYLE_CONFIG,
  TEMPLATE_PREVIEW_DATA,
} from "@/components/features/resume-templates";
import { TemplateSelector } from "@/components/features/builder/components/template-selector";
import BrandLogo from "@/components/shared/brand-logo";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { LandingFooter } from "@/components/features/landing/landing-footer";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";

export function ResumeTemplatesClient() {
  const router = useRouter();

  const handleSelectTemplate = async (id?: string) => {
    const redirectUrl = id ? `/dashboard/builder?template=${id}&step=2` : '/dashboard/builder'
    try {
      const existing = await db.profiles.toCollection().first();
      if (existing) {
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to check profile in IndexedDB:", error);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ****** Header Navigation ****** */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo />
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium hidden md:inline-flex"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button
                size="sm"
                className="rounded-xl px-4 py-2 text-sm font-medium"
                onClick={() => handleSelectTemplate()}
              >
                Build My Resume
                <ChevronRight className="ml-1 size-4" />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ****** Hero Section ****** */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-linear-to-b from-primary/5 via-transparent to-transparent">
        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 size-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-40 size-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 animate-fade-in">
            <Sparkles className="size-3.5" />
            Recruiter-Approved & ATS-Friendly Designs
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white leading-tight">
            Choose Your Professional <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Resume Template
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Select a template below to start building. Every layout is fully optimized to pass applicant tracking systems (ATS) and designed to land you interviews.
          </p>

          {/* Feature Highlights Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-xs hover:border-primary/20 transition-all">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="font-semibold text-base">ATS Optimized</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Engineered with clean vertical hierarchies, standard fonts, and tables-free structures to ensure accurate parsing.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-xs hover:border-primary/20 transition-all">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 mb-4">
                <Wand2 className="size-5" />
              </div>
              <h3 className="font-semibold text-base">Fully Customizable</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Fine-tune margins, font sizes, line height, select custom colors, and reorder sections with simple drag-and-drop.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-xs hover:border-primary/20 transition-all">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-4">
                <FileText className="size-5" />
              </div>
              <h3 className="font-semibold text-base">100% Private & Local</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Your data is stored strictly in your browser's IndexedDB. No login required, and no third-party server tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ****** Templates Grid Section ****** */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 pb-24 flex-grow">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
            Select a template to get started
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Click on any layout to load the builder pre-filled with demo data.
          </p>
        </div>

        <div className="relative">
          <TemplateSelector
            templates={RESUME_TEMPLATES}
            selectedId=""
            onSelect={handleSelectTemplate}
            styleConfig={DEFAULT_STYLE_CONFIG}
            previewData={TEMPLATE_PREVIEW_DATA}
            layout="grid"
          />
        </div>
      </section>

      {/* ****** Footer ****** */}
      <LandingFooter />
    </div>
  );
}
