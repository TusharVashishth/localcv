"use client";

/* ****** Company Resume Builder — mirrors builder-client.tsx using company resume data ****** */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
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
import { TemplateSelector } from "@/components/features/builder/components/template-selector";
import { EditorToolbar } from "@/components/features/builder/components/editor-toolbar";
import {
  ResumePreview,
  PREVIEW_ELEMENT_ID,
} from "@/components/features/builder/components/resume-preview";
import { DownloadActions } from "@/components/features/builder/components/download-actions";
import { SectionPriorityEditor } from "@/components/features/builder/components/section-priority-editor";
import { useCompanyResume } from "../hooks/use-company-resumes";
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

type BuilderStep = 1 | 2 | 3;

const STEP_META: Record<
  BuilderStep,
  { title: string; subtitle: string; progress: number }
> = {
  1: {
    title: "Pick a Template",
    subtitle: "Each layout is prefilled with your tailored resume data.",
    progress: 33,
  },
  2: {
    title: "Customize Your Resume",
    subtitle: "Adjust visual style and section order for this target company.",
    progress: 67,
  },
  3: {
    title: "Export Your Resume",
    subtitle: "Your tailored resume is polished and ready to send.",
    progress: 100,
  },
};

interface CompanyResumeBuilderClientProps {
  id: number;
}

export function CompanyResumeBuilderClient({
  id,
}: CompanyResumeBuilderClientProps) {
  const { companyResume, isLoading } = useCompanyResume(id);
  const [currentStep, setCurrentStep] = useState<BuilderStep>(1);

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    RESUME_TEMPLATES[0]?.id ?? "classic",
  );
  const [styleConfig, setStyleConfig] =
    useState<ResumeStyleConfig>(DEFAULT_STYLE_CONFIG);
  const [showToolbar, setShowToolbar] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [sectionOrderByTemplate, setSectionOrderByTemplate] = useState<
    Record<string, ResumeSectionKey[]>
  >(() => ({
    [RESUME_TEMPLATES[0]?.id ?? "classic"]: getTemplateDefaultSectionOrder(
      RESUME_TEMPLATES[0]?.id ?? "classic",
    ),
  }));

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

  const handleSelectTemplate = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);
    setSectionOrderByTemplate((prev) => {
      if (prev[templateId]) return prev;
      return {
        ...prev,
        [templateId]: getTemplateDefaultSectionOrder(templateId),
      };
    });
    const tpl = RESUME_TEMPLATES.find((t) => t.id === templateId);
    if (tpl?.defaultAccentColor) {
      setStyleConfig((prev) => ({
        ...prev,
        accentColor: tpl.defaultAccentColor!,
      }));
    }
  }, []);

  const handleSelectTemplateInModal = useCallback(
    (templateId: string) => {
      handleSelectTemplate(templateId);
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
      <main className="container mx-auto px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading resume…</p>
      </main>
    );
  }

  if (!companyResume) {
    return (
      <main className="container mx-auto px-6 py-8">
        <Card className="border-dashed">
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Company resume not found.
            </p>
            <Link href="/dashboard/company-resumes">
              <Button>Back to Company Resumes</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const resumeData = {
    profile: companyResume.profile,
    summary: companyResume.summary,
    experience: companyResume.experience,
    education: companyResume.education,
    skills: companyResume.skills,
    projects: companyResume.projects,
    certifications: companyResume.certifications,
    languages: companyResume.languages,
  };

  const step = STEP_META[currentStep];

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/company-resumes">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="size-3.5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">
              {companyResume.companyName}
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-tailored resume builder
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-linear-to-br from-primary/12 via-background to-primary/5 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Tailored Resume Flow
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mt-1">
              {step.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {step.subtitle}
            </p>
          </div>
          <div className="w-full sm:w-52">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-primary to-emerald-500"
                initial={false}
                animate={{ width: `${step.progress}%` }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Step {currentStep} of 3
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.section
            key="company-builder-step-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Select a template for {companyResume.companyName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Explore all styles with your tailored data prefilled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(15,76,129,0.08),transparent_42%)] p-4 sm:p-5">
                  <TemplateSelector
                    templates={RESUME_TEMPLATES}
                    selectedId={selectedTemplate.id}
                    onSelect={handleSelectTemplate}
                    styleConfig={styleConfig}
                    previewData={resumeData}
                    layout="grid"
                  />
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Selected:{" "}
                    <span className="font-medium text-foreground">
                      {selectedTemplate.name}
                    </span>
                  </p>
                  <Button className="gap-2" onClick={() => setCurrentStep(2)}>
                    Continue to customization
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {currentStep === 2 && (
          <motion.section
            key="company-builder-step-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-4"
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="size-4 text-muted-foreground" />
                      Edit this company version
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Style controls and section priority now stay together
                      above the preview for easier editing on every screen.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setIsTemplateModalOpen(true)}
                    >
                      <WandSparkles className="size-3.5" />
                      Change template
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => setShowToolbar((v) => !v)}
                    >
                      <Settings2 className="size-3.5" />
                      {showToolbar ? "Hide tools" : "Show tools"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-muted/20 p-3 sm:p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Editing{" "}
                      <span className="font-semibold text-foreground">
                        {selectedTemplate.name}
                      </span>{" "}
                      for {companyResume.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tune visual style, then reorder content based on the
                      target role.
                    </p>
                  </div>
                </div>

                {showToolbar && (
                  <EditorToolbar
                    styleConfig={styleConfig}
                    onChange={handleStyleChange}
                  />
                )}
              </CardContent>
            </Card>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {selectedTemplate.name} Preview
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Live preview for{" "}
                    {companyResume.profile.fullName || "your profile"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-5">
                  <ResumePreview
                    template={selectedTemplate}
                    data={resumeData}
                    styleConfig={styleConfig}
                    sectionOrder={selectedSectionOrder}
                  />
                </CardContent>
              </Card>

              <Card className="lg:sticky lg:top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Rearrange sections
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Keep ordering controls in the sidebar while style controls
                    stay at the top.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border bg-background/85 p-4">
                    <SectionPriorityEditor
                      order={selectedSectionOrder}
                      onChange={handleSectionOrderChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setCurrentStep(1)}
              >
                <ArrowLeft className="size-4" />
                Back to templates
              </Button>
              <Button className="gap-2" onClick={() => setCurrentStep(3)}>
                Continue to downloads
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.section>
        )}

        {currentStep === 3 && (
          <motion.section
            key="company-builder-step-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-4"
          >
            <section className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
              <Card className="relative overflow-hidden border-primary/20 bg-linear-to-br from-primary/10 via-background to-emerald-500/10">
                <div className="absolute -right-10 -top-10 size-28 rounded-full bg-primary/15 blur-2xl" />
                <div className="absolute -left-8 bottom-4 size-24 rounded-full bg-emerald-500/15 blur-2xl" />
                <CardContent className="relative flex min-h-80 flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 3.2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="rounded-[2rem] border border-white/60 bg-white/90 p-5 shadow-2xl shadow-primary/15"
                    >
                      <div className="w-48 rounded-[1.4rem] border bg-white p-4 text-left shadow-inner">
                        <div className="flex items-center gap-2">
                          <div className="size-10 rounded-full bg-primary/15" />
                          <div className="space-y-1.5">
                            <div className="h-2 w-20 rounded-full bg-primary/40" />
                            <div className="h-2 w-14 rounded-full bg-muted" />
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="h-2 rounded-full bg-muted" />
                          <div className="h-2 w-5/6 rounded-full bg-muted" />
                          <div className="h-2 w-2/3 rounded-full bg-muted" />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="h-10 rounded-xl bg-primary/10" />
                          <div className="h-10 rounded-xl bg-emerald-500/10" />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 14,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="absolute -right-6 -top-6 flex size-14 items-center justify-center rounded-full border border-primary/25 bg-background/80"
                    >
                      <Sparkles className="size-5 text-primary" />
                    </motion.div>
                  </motion.div>
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Targeted and polished
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This version is aligned for the role and ready for export.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-primary/25">
                <div className="absolute -top-12 -right-12 size-40 rounded-full bg-primary/12 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 size-44 rounded-full bg-emerald-500/10 blur-2xl" />
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-primary" />
                    Excellent work on this tailored version
                  </CardTitle>
                  <CardDescription className="text-sm">
                    You now have a focused resume version for{" "}
                    {companyResume.companyName} with strong readability and
                    structure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="rounded-2xl border bg-muted/40 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                        <Check className="size-3" />
                        Role focused
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">
                        <Download className="size-3" />
                        Export ready
                      </span>
                    </div>
                    <p className="mt-3 text-sm">
                      <span className="font-semibold">
                        {companyResume.profile.fullName || "Your resume"}
                      </span>{" "}
                      is ready in the{" "}
                      <span className="font-semibold">
                        {selectedTemplate.name}
                      </span>{" "}
                      template.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Download it now and apply with a sharper, company-specific
                      story.
                    </p>
                  </div>

                  <DownloadActions
                    data={resumeData}
                    templateId={selectedTemplate.id}
                    previewElementId={PREVIEW_ELEMENT_ID}
                  />

                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center pt-2 border-t">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ArrowLeft className="size-4" />
                      Back to edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="gap-2"
                      onClick={() => {
                        setCurrentStep(2);
                        setIsTemplateModalOpen(true);
                      }}
                    >
                      <WandSparkles className="size-4" />
                      Try another template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="sr-only" aria-hidden>
              <ResumePreview
                template={selectedTemplate}
                data={resumeData}
                styleConfig={styleConfig}
                sectionOrder={selectedSectionOrder}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Switch template</DialogTitle>
            <DialogDescription>
              Pick a new template while preserving style edits and section
              ordering.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4 max-h-[70vh] overflow-y-auto">
            <div className="rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(15,76,129,0.08),transparent_42%)] p-4 sm:p-5">
              <TemplateSelector
                templates={RESUME_TEMPLATES}
                selectedId={selectedTemplate.id}
                onSelect={handleSelectTemplateInModal}
                styleConfig={styleConfig}
                previewData={resumeData}
                layout="grid"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
