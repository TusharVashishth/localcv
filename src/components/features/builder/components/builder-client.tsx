"use client";

/* ****** Resume Builder — Client Orchestrator — 2026 Redesign ****** */

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileCode2,
  FileText,
  Layers,
  Palette,
  Settings2,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import {
  RESUME_TEMPLATES,
  DEFAULT_STYLE_CONFIG,
  getTemplateDefaultSectionOrder,
  resolveSectionOrder,
  type ResumeSectionKey,
  type ResumeStyleConfig,
} from "@/components/features/resume-templates";
import { TemplateSelector } from "./template-selector";
import { EditorToolbar } from "./editor-toolbar";
import { ResumePreview, PREVIEW_ELEMENT_ID } from "./resume-preview";
import { DownloadActions } from "./download-actions";
import { SectionPriorityEditor } from "./section-priority-editor";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type BuilderStep = 1 | 2 | 3;

const STEP_META: Record<
  BuilderStep,
  { title: string; subtitle: string; progress: number; icon: React.ReactNode }
> = {
  1: {
    title: "Pick a Template",
    subtitle: "Pre-filled with your profile. Choose your style direction.",
    progress: 33,
    icon: <Palette className="size-4" />,
  },
  2: {
    title: "Customize",
    subtitle: "Fine-tune style, font, color and section order.",
    progress: 67,
    icon: <Settings2 className="size-4" />,
  },
  3: {
    title: "Export",
    subtitle: "Download your polished resume and start applying.",
    progress: 100,
    icon: <Download className="size-4" />,
  },
};

/* ****** Modern numbered step indicator ****** */
function StepIndicator({ currentStep }: { currentStep: BuilderStep }) {
  const steps = [1, 2, 3] as BuilderStep[];
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                isDone
                  ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground",
              )}
            >
              {isDone ? <Check className="size-3.5" strokeWidth={2.5} /> : step}
            </div>
            {i < steps.length - 1 && (
              <div className="relative mx-1 h-0.5 w-8 sm:w-14 overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function BuilderClient() {
  const { profile, isLoading } = useProfile();
  const searchParams = useSearchParams();
  const templateParam = searchParams ? searchParams.get("template") : null;
  const stepParam = searchParams ? searchParams.get("step") : null;

  const [currentStep, setCurrentStep] = useState<BuilderStep>(() => {
    if (stepParam === "2") return 2;
    if (stepParam === "3") return 3;
    return 1;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    if (templateParam && RESUME_TEMPLATES.some((t) => t.id === templateParam)) {
      return templateParam;
    }
    return RESUME_TEMPLATES[0]?.id ?? "classic";
  });

  const [styleConfig, setStyleConfig] = useState<ResumeStyleConfig>(() => {
    const baseConfig = DEFAULT_STYLE_CONFIG;
    const initialTplId = (templateParam && RESUME_TEMPLATES.some((t) => t.id === templateParam))
      ? templateParam
      : (RESUME_TEMPLATES[0]?.id ?? "classic");
    const tpl = RESUME_TEMPLATES.find((t) => t.id === initialTplId);
    if (tpl?.defaultAccentColor) {
      return { ...baseConfig, accentColor: tpl.defaultAccentColor };
    }
    return baseConfig;
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const [sectionOrderByTemplate, setSectionOrderByTemplate] = useState<
    Record<string, ResumeSectionKey[]>
  >(() => {
    const initialTplId = (templateParam && RESUME_TEMPLATES.some((t) => t.id === templateParam))
      ? templateParam
      : (RESUME_TEMPLATES[0]?.id ?? "classic");
    return {
      [initialTplId]: getTemplateDefaultSectionOrder(initialTplId),
    };
  });

  const selectedTemplate = useMemo(
    () =>
      RESUME_TEMPLATES.find((t) => t.id === selectedTemplateId) ??
      RESUME_TEMPLATES[0],
    [selectedTemplateId],
  );

  const selectedSectionOrder = useMemo(
    () =>
      resolveSectionOrder(
        sectionOrderByTemplate[selectedTemplate.id] ??
          getTemplateDefaultSectionOrder(selectedTemplate.id),
      ),
    [sectionOrderByTemplate, selectedTemplate.id],
  );

  const goToStep = useCallback((step: BuilderStep) => {
    setCurrentStep(step);
  }, []);

  /* ****** Apply accent color default from template when switching ****** */
  const handleSelectTemplate = useCallback((id: string) => {
    setSelectedTemplateId(id);
    setSectionOrderByTemplate((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: getTemplateDefaultSectionOrder(id) };
    });
    const tpl = RESUME_TEMPLATES.find((t) => t.id === id);
    if (tpl?.defaultAccentColor) {
      setStyleConfig((prev) => ({
        ...prev,
        accentColor: tpl.defaultAccentColor!,
      }));
    }
  }, []);

  const handleSelectTemplateInModal = useCallback(
    (id: string) => {
      handleSelectTemplate(id);
      setIsTemplateModalOpen(false);
    },
    [handleSelectTemplate],
  );

  const handleStyleChange = useCallback(
    (updates: Partial<ResumeStyleConfig>) => {
      setStyleConfig((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const handleSectionOrderChange = useCallback(
    (nextOrder: ResumeSectionKey[]) => {
      setSectionOrderByTemplate((prev) => ({
        ...prev,
        [selectedTemplate.id]: resolveSectionOrder(nextOrder),
      }));
    },
    [selectedTemplate.id],
  );

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="size-8 rounded-full border-2 border-primary/20 border-t-primary"
          />
          <p className="text-sm text-muted-foreground">Loading your profile…</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-sm rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="size-5 text-primary" />
          </div>
          <h2 className="text-base font-semibold">Complete your profile first</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We need your profile data to generate resume templates.
          </p>
          <Link href="/dashboard/profile" className="mt-5 inline-flex">
            <Button className="rounded-xl">Complete Profile</Button>
          </Link>
        </div>
      </main>
    );
  }

  const step = STEP_META[currentStep];

  return (
    <main className="min-h-screen bg-background">
      {/* ****** Sticky step header ****** */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Left: title */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {step.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">{step.title}</p>
                <p className="hidden text-[11px] text-muted-foreground sm:block truncate">{step.subtitle}</p>
              </div>
            </div>

            {/* Center: step indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* Right: nav buttons */}
            <div className="flex shrink-0 items-center gap-2">
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => goToStep((currentStep - 1) as BuilderStep)}
                >
                  <ArrowLeft className="size-3.5" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              {currentStep < 3 && (
                <Button
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs"
                  onClick={() => goToStep((currentStep + 1) as BuilderStep)}
                >
                  <span className="hidden sm:inline">
                    {currentStep === 1 ? "Customize" : "Export"}
                  </span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ****** Page content ****** */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {/* =================== STEP 1: Template Selection =================== */}
          {currentStep === 1 && (
            <motion.section
              key="builder-step-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-5"
            >
              {/* ****** Hero hint strip ****** */}
              <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent px-4 py-3">
                <Sparkles className="size-4 shrink-0 text-primary" />
                <p className="text-sm text-foreground/80">
                  <span className="font-semibold">Your profile is already applied.</span>{" "}
                  <span className="text-muted-foreground">Click a template to select, then continue.</span>
                </p>
                <div className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {selectedTemplate.name} selected
                </div>
              </div>

              {/* ****** Template grid with gradient background ****** */}
              <div className="relative overflow-hidden rounded-[2rem] border border-border/60">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)] pointer-events-none" />
                <div className="absolute -top-20 -left-20 size-64 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-violet-500/6 blur-3xl pointer-events-none" />

                {/* ****** Max-width constrained grid so cards don't stretch too wide ****** */}
                <div className="relative p-4 sm:p-6">
                  <div className="mx-auto max-w-7xl">
                    <TemplateSelector
                      templates={RESUME_TEMPLATES}
                      selectedId={selectedTemplate.id}
                      onSelect={handleSelectTemplate}
                      styleConfig={styleConfig}
                      previewData={profile}
                      layout="grid"
                    />
                  </div>
                </div>
              </div>

              {/* ****** Bottom CTA ****** */}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-card/60 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className="size-3 rounded-full shadow-sm"
                    style={{ backgroundColor: styleConfig.accentColor }}
                  />
                  <span className="text-muted-foreground">Template:</span>
                  <span className="font-semibold">{selectedTemplate.name}</span>
                </div>
                <Button className="gap-2 rounded-xl" onClick={() => goToStep(2)}>
                  Continue to customization
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.section>
          )}

          {/* =================== STEP 2: Customize =================== */}
          {currentStep === 2 && (
            <motion.section
              key="builder-step-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {/* ****** Horizontal style toolbar — always visible above preview ****** */}
              <div className="rounded-2xl border bg-card/90 backdrop-blur-sm">
                {/* Top bar: template info + change button */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="size-3 rounded-full shadow-sm shrink-0"
                      style={{ backgroundColor: styleConfig.accentColor }}
                    />
                    <span className="text-sm font-medium">
                      <span className="font-semibold">{selectedTemplate.name}</span>
                      <span className="text-muted-foreground"> · {profile.profile.fullName || "Your profile"}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <WandSparkles className="size-3.5" />
                    Change template
                  </button>
                </div>

                {/* ****** Style controls toolbar row — horizontally scrollable on mobile ****** */}
                <div className="overflow-x-auto px-4 py-3 scrollbar-hide">
                  <EditorToolbar
                    styleConfig={styleConfig}
                    onChange={handleStyleChange}
                    compact
                  />
                </div>
              </div>

              {/* ****** Main layout: slim sidebar (section order) + preview ****** */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">

                {/* ---- LEFT SIDEBAR — section reorder only ---- */}
                <aside className="w-full shrink-0 lg:w-56 xl:w-60 lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
                  <div className="flex flex-col gap-3 rounded-2xl border bg-card/80 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
                        <Layers className="size-3 text-primary" />
                      </div>
                      <span className="text-xs font-semibold">Section Order</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground -mt-1">
                      Drag or reorder sections below.
                    </p>
                    <SectionPriorityEditor
                      order={selectedSectionOrder}
                      onChange={handleSectionOrderChange}
                    />
                  </div>
                </aside>

                {/* ---- PREVIEW PANE ---- */}
                <div className="min-w-0 flex-1 flex flex-col gap-3">
                  {/* Resume preview card */}
                  <Card className="overflow-hidden border-border/60">
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
                        <CardDescription className="text-xs">
                          Updates instantly as you adjust
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4">
                      <ResumePreview
                        template={selectedTemplate}
                        data={profile}
                        styleConfig={styleConfig}
                        sectionOrder={selectedSectionOrder}
                      />
                    </CardContent>
                  </Card>

                  {/* Bottom nav */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="gap-2 rounded-xl"
                      size="sm"
                      onClick={() => goToStep(1)}
                    >
                      <ArrowLeft className="size-3.5" />
                      Templates
                    </Button>
                    <Button
                      className="gap-2 rounded-xl"
                      size="sm"
                      onClick={() => goToStep(3)}
                    >
                      Continue to export
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* =================== STEP 3: Export =================== */}
          {currentStep === 3 && (
            <motion.section
              key="builder-step-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* ****** Celebration hero ****** */}
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-violet-500/8 p-6 sm:p-8 text-center">
                {/* Background glows */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,hsl(var(--primary)/0.18),transparent)] pointer-events-none" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 size-40 rounded-full bg-primary/12 blur-3xl pointer-events-none" />

                {/* Floating sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${10 + i * 16}%`,
                      top: `${15 + (i % 3) * 20}%`,
                    }}
                    animate={{
                      y: [0, -12, 0],
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2.4 + i * 0.3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                  >
                    <Sparkles className="size-3 sm:size-4 text-primary/50" />
                  </motion.div>
                ))}

                {/* Center icon */}
                <div className="relative mx-auto mb-4 flex size-16 sm:size-20 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.15, 0.5] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "backOut", delay: 0.1 }}
                    className="relative flex size-14 sm:size-18 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/30"
                  >
                    <CheckCircle2 className="size-7 sm:size-9 text-primary-foreground" />
                  </motion.div>
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-xl sm:text-2xl font-bold tracking-tight"
                >
                  Your resume is ready!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto"
                >
                  Great work,{" "}
                  <span className="font-semibold text-foreground">
                    {profile.profile.fullName?.split(" ")[0] || "friend"}
                  </span>
                  . Your{" "}
                  <span className="font-semibold text-foreground">
                    {selectedTemplate.name}
                  </span>{" "}
                  resume is polished and export-ready.
                </motion.p>

                {/* ****** Summary chips ****** */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="mt-4 flex flex-wrap justify-center gap-2"
                >
                  {[
                    { label: "Finalized layout", icon: <Check className="size-3" /> },
                    { label: "ATS-friendly", icon: <CheckCircle2 className="size-3" /> },
                    { label: "Export ready", icon: <Download className="size-3" /> },
                  ].map(({ label, icon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {icon}
                      {label}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* ****** Download options ****** */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-xl bg-primary/10">
                    <Download className="size-3.5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold">Download Your Resume</h3>
                  <span className="rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Choose format
                  </span>
                </div>

                <DownloadActions
                  data={profile}
                  templateId={selectedTemplate.id}
                  previewElementId={PREVIEW_ELEMENT_ID}
                />
              </div>

              {/* ****** Format explainer ****** */}
              <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-3">
                {[
                  {
                    icon: <Download className="size-4 text-primary" />,
                    title: "PDF",
                    desc: "Best for applications. Preserves formatting exactly.",
                    recommended: true,
                  },
                  {
                    icon: <FileCode2 className="size-4 text-sky-500" />,
                    title: "HTML",
                    desc: "Great for hosting or editing in a browser.",
                    recommended: false,
                  },
                  {
                    icon: <FileText className="size-4 text-fuchsia-500" />,
                    title: "Markdown",
                    desc: "Perfect for version control and quick edits.",
                    recommended: false,
                  },
                ].map(({ icon, title, desc, recommended }) => (
                  <div key={title} className="flex gap-3">
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div>
                      <p className="text-xs font-semibold flex items-center gap-1.5">
                        {title}
                        {recommended && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wide">
                            Recommended
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ****** Bottom navigation ****** */}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl"
                  size="sm"
                  onClick={() => goToStep(2)}
                >
                  <ArrowLeft className="size-3.5" />
                  Back to editing
                </Button>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-xl text-xs"
                  size="sm"
                  onClick={() => {
                    goToStep(2);
                    setIsTemplateModalOpen(true);
                  }}
                >
                  <WandSparkles className="size-3.5" />
                  Try another template
                </Button>
              </div>

              {/* ****** Hidden preview wrapper ensures exports can still reference current preview id ****** */}
              <div className="sr-only" aria-hidden>
                <ResumePreview
                  template={selectedTemplate}
                  data={profile}
                  styleConfig={styleConfig}
                  sectionOrder={selectedSectionOrder}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ****** Template switch modal ****** */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-5 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <WandSparkles className="size-4 text-primary" />
              Switch template
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pick a different look — your style settings and section order are preserved.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-4">
            {/* ****** Gradient background ****** */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)] pointer-events-none" />
              <div className="relative p-4">
                {/* ****** Smaller preview scale inside the dialog ****** */}
                <TemplateSelector
                  templates={RESUME_TEMPLATES}
                  selectedId={selectedTemplate.id}
                  onSelect={handleSelectTemplateInModal}
                  styleConfig={styleConfig}
                  previewData={profile}
                  layout="grid"
                  previewScale={0.308}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
