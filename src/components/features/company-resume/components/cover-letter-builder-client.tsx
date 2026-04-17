"use client";

/* ****** Cover Letter Builder — template selector, style controls, preview, and export ****** */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileCode2,
  FileText,
  FileUp,
  Settings2,
  Sparkles,
  Search,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  COVER_LETTER_TEMPLATES,
  DEFAULT_COVER_LETTER_STYLE,
  COVER_LETTER_FONT_OPTIONS,
  COVER_LETTER_FONT_SIZE_OPTIONS,
  COVER_LETTER_TEXT_COLOR_PRESETS,
  COVER_LETTER_ACCENT_COLOR_PRESETS,
  exportCoverLetterToHtml,
  exportCoverLetterToMarkdown,
} from "@/components/features/cover-letter-templates";
import type { CoverLetterStyleConfig } from "@/lib/db/schema";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  useCompanyResume,
  useCompanyResumeCoverLetter,
} from "../hooks/use-company-resumes";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

/* ****** Preview element ID for PDF print ****** */
const COVER_PREVIEW_ID = "cover-letter-preview";

/* ****** Generation step definitions ****** */
const GENERATION_STEPS = [
  { Icon: Search, label: "Analyzing job description" },
  { Icon: Target, label: "Matching your experience" },
  { Icon: FileText, label: "Crafting cover letter" },
  { Icon: Sparkles, label: "Polishing the final draft" },
] as const;

interface CoverLetterBuilderClientProps {
  id: number;
}

export function CoverLetterBuilderClient({
  id,
}: CoverLetterBuilderClientProps) {
  const { companyResume, isLoading } = useCompanyResume(id);
  const {
    coverLetter,
    coverLetterStyle,
    saveCoverLetter,
    updateCoverLetterStyle,
  } = useCompanyResumeCoverLetter(id);
  const { config, hasApiKey, getDecryptedApiKey } = useAIConfig();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);

  /* ****** Local style state — initialised from persisted style or default ****** */
  const [styleConfig, setStyleConfig] = useState<CoverLetterStyleConfig>(
    () => coverLetterStyle ?? DEFAULT_COVER_LETTER_STYLE,
  );

  const selectedTemplate = useMemo(
    () =>
      COVER_LETTER_TEMPLATES.find((t) => t.id === styleConfig.template) ??
      COVER_LETTER_TEMPLATES[0],
    [styleConfig.template],
  );

  function handleSelectTemplate(templateId: string) {
    const tpl = COVER_LETTER_TEMPLATES.find((t) => t.id === templateId);
    setStyleConfig((prev) => ({
      ...prev,
      template: templateId,
      accentColor: tpl?.defaultAccentColor ?? prev.accentColor,
    }));
  }

  const handleStyleChange = useCallback(
    (updates: Partial<CoverLetterStyleConfig>) => {
      setStyleConfig((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  async function handleSaveStyle() {
    await updateCoverLetterStyle(styleConfig);
    toast.success("Style preferences saved.");
  }

  /* ****** AI generation ****** */
  async function handleGenerate() {
    if (!companyResume) return;

    try {
      setIsGenerating(true);

      const apiKey = await getDecryptedApiKey();
      if (!apiKey) {
        toast.error(
          "Could not retrieve AI key. Please reconfigure it in the dashboard.",
        );
        return;
      }

      const response = await fetch("/api/resume/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyResume.companyName,
          jobDescription: companyResume.jobDescription,
          profileData: {
            profile: companyResume.profile,
            summary: companyResume.summary,
            experience: companyResume.experience,
            skills: companyResume.skills,
            projects: companyResume.projects,
          },
          config: {
            provider: config?.provider ?? "",
            modelName: config?.modelName ?? "",
            apiKey,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(
          data.error ?? "Failed to generate cover letter. Please try again.",
        );
        return;
      }

      await saveCoverLetter({ ...data.coverLetter, generatedAt: new Date() });
      await updateCoverLetterStyle(styleConfig);
      toast.success("Cover letter generated!");
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  /* ****** Export helpers ****** */
  function triggerDownload(content: string, fileName: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function handleDownloadHtml() {
    if (!coverLetter || !companyResume) return;
    const html = exportCoverLetterToHtml(
      coverLetter,
      companyResume.profile,
      companyResume.companyName,
    );
    triggerDownload(
      html,
      `cover-letter-${companyResume.companyName}.html`,
      "text/html;charset=utf-8",
    );
    toast.success("HTML cover letter downloaded");
  }

  function handleDownloadMarkdown() {
    if (!coverLetter || !companyResume) return;
    const md = exportCoverLetterToMarkdown(
      coverLetter,
      companyResume.profile,
      companyResume.companyName,
    );
    triggerDownload(
      md,
      `cover-letter-${companyResume.companyName}.md`,
      "text/markdown;charset=utf-8",
    );
    toast.success("Markdown cover letter downloaded");
  }

  function handleDownloadPdf() {
    const element = document.getElementById(COVER_PREVIEW_ID);
    if (!element) {
      toast.error("Preview element not found.");
      return;
    }

    const styleTagsHtml = Array.from(document.querySelectorAll("style"))
      .map((s) => s.outerHTML)
      .join("\n");
    const linkTagsHtml = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]'),
    )
      .map((l) => l.outerHTML)
      .join("\n");
    const htmlClass = document.documentElement.className;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Popup blocked — please allow popups and try again.");
      return;
    }

    const baseName = companyResume?.companyName ?? "cover-letter";
    printWindow.document.write(`<!DOCTYPE html>
<html class="${htmlClass}">
<head>
  <meta charset="utf-8" />
  <title>${baseName} Cover Letter</title>
  ${linkTagsHtml}
  ${styleTagsHtml}
  <style>
    *, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; background: white; }
    @page { margin: 0; size: A4 portrait; }
  </style>
</head>
<body>
  ${element.outerHTML}
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); window.close(); }, 600);
    });
  <\/script>
</body>
</html>`);
    printWindow.document.close();
    toast.success('Print dialog opened — choose "Save as PDF" to download');
  }

  /* ****** Loading / not found states ****** */
  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (!companyResume) {
    return (
      <main className="container mx-auto px-6 py-8">
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Company resume not found.
            </p>
            <Link href="/dashboard/company-resumes">
              <Button className="mt-4">Back to Company Resumes</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const TemplateComponent = selectedTemplate.component;

  return (
    <main className="container mx-auto px-6 py-8 space-y-4">
      {/* ****** Back nav + title ****** */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/company-resumes`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="size-3.5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">{companyResume.companyName}</h1>
          <p className="text-xs text-muted-foreground">Cover Letter Builder</p>
        </div>
      </div>

      {/* ****** Style Toolbar ****** */}
      {coverLetter && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Style Controls
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={handleSaveStyle}
              >
                Save Style
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setShowToolbar((v) => !v)}
              >
                <Settings2 className="size-3.5" />
                {showToolbar ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          {showToolbar && (
            <CoverLetterStyleToolbar
              styleConfig={styleConfig}
              onChange={handleStyleChange}
            />
          )}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] items-start">
        {/* ****** Left Panel — template selector ****** */}
        <div className="lg:sticky lg:top-4">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-muted-foreground" />
                Choose Template
              </CardTitle>
              <CardDescription className="text-xs">
                Pick a style for {companyResume.companyName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {COVER_LETTER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-all hover:bg-muted/50",
                      styleConfig.template === tpl.id
                        ? "border-primary ring-1 ring-primary bg-primary/5"
                        : "border-border",
                    )}
                  >
                    <p className="text-xs font-semibold truncate">{tpl.name}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                      {tpl.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* ****** Generate / Regenerate button ****** */}
              <div className="pt-2 border-t">
                <Button
                  className="w-full gap-2"
                  disabled={!hasApiKey || isGenerating}
                  onClick={handleGenerate}
                >
                  <Sparkles className="size-3.5" />
                  {coverLetter ? "Regenerate" : "Generate Cover Letter"}
                </Button>
                {!hasApiKey && (
                  <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                    No AI key configured. Add one from the dashboard.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ****** Right Panel — preview ****** */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">
                  {selectedTemplate.name} Preview
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {companyResume.profile.fullName} — {companyResume.companyName}
                </CardDescription>
              </div>
            </div>
            {coverLetter && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  variant="outline"
                  className="gap-2 sm:flex-1"
                  onClick={handleDownloadPdf}
                >
                  <Download className="size-4" />
                  Download (.pdf)
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 sm:flex-1"
                  onClick={handleDownloadHtml}
                >
                  <FileCode2 className="size-4" />
                  Download (.html)
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 sm:flex-1"
                  onClick={handleDownloadMarkdown}
                >
                  <FileText className="size-4" />
                  Download (.md)
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {isGenerating ? (
                /* ****** AI generation loading state ****** */
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="py-12 flex flex-col items-center gap-7"
                >
                  <div className="relative flex items-center justify-center size-36">
                    <OrbitingCircles radius={58} duration={9} iconSize={30}>
                      <FileText className="size-4 text-blue-500" />
                      <Target className="size-4 text-emerald-500" />
                      <Sparkles className="size-4 text-violet-500" />
                      <Search className="size-4 text-pink-500" />
                    </OrbitingCircles>
                    <OrbitingCircles
                      radius={30}
                      duration={5}
                      reverse
                      iconSize={22}
                      path={false}
                    >
                      <Zap className="size-3 text-amber-400" />
                      <Sparkles className="size-3 text-cyan-400" />
                    </OrbitingCircles>
                    <motion.div
                      animate={{
                        scale: [1, 1.07, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(139,92,246,0.3)",
                          "0 0 20px 6px rgba(139,92,246,0.25)",
                          "0 0 0 0 rgba(139,92,246,0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute z-10 flex items-center justify-center size-14 rounded-2xl bg-linear-to-br from-violet-500 to-pink-500 text-white shadow-lg"
                    >
                      <FileUp className="size-6" />
                    </motion.div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-base">
                      Crafting your cover letter…
                    </p>
                    <p className="text-xs text-muted-foreground">
                      AI is writing a personalised letter — this may take 15–30
                      seconds
                    </p>
                  </div>
                  <div className="w-full max-w-xs space-y-3">
                    {GENERATION_STEPS.map(({ Icon, label }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.55,
                          duration: 0.35,
                          ease: "easeOut",
                        }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: i * 0.55 + 0.2,
                            type: "spring",
                            stiffness: 320,
                            damping: 22,
                          }}
                          className="flex items-center justify-center size-7 rounded-lg bg-muted/70 text-muted-foreground shrink-0"
                        >
                          <Icon className="size-3.5" />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">
                          {label}
                        </span>
                        {i === GENERATION_STEPS.length - 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                              delay: (GENERATION_STEPS.length - 1) * 0.55 + 0.6,
                              duration: 1.2,
                              repeat: Infinity,
                            }}
                            className="ml-auto size-2 rounded-full bg-primary"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : coverLetter ? (
                /* ****** Cover letter preview ****** */
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  id={COVER_PREVIEW_ID}
                  className="overflow-hidden rounded-md border"
                >
                  <TemplateComponent
                    content={coverLetter}
                    profile={companyResume.profile}
                    companyName={companyResume.companyName}
                    styleConfig={styleConfig}
                  />
                </motion.div>
              ) : (
                /* ****** Empty state — no cover letter yet ****** */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 flex flex-col items-center gap-4 text-center"
                >
                  <div className="size-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                    <FileText className="size-6 text-violet-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">No cover letter yet</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Click <strong>Generate Cover Letter</strong> on the left
                      to create one tailored to {companyResume.companyName}.
                    </p>
                  </div>
                  <Button
                    className="gap-2 mt-2"
                    disabled={!hasApiKey || isGenerating}
                    onClick={handleGenerate}
                  >
                    <Sparkles className="size-3.5" />
                    Generate Cover Letter
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

/* ****** Cover Letter Style Toolbar ****** */

interface CoverLetterStyleToolbarProps {
  styleConfig: CoverLetterStyleConfig;
  onChange: (updates: Partial<CoverLetterStyleConfig>) => void;
}

function CoverLetterStyleToolbar({
  styleConfig,
  onChange,
}: CoverLetterStyleToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-lg border bg-muted/30 text-sm">
      {/* Font Family */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          Font
        </span>
        <div className="flex gap-1 overflow-x-auto pb-0.5 max-w-65 lg:max-w-80 scrollbar-hide">
          {COVER_LETTER_FONT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                onChange({
                  fontFamily: opt.value,
                  fontFamilyValue: opt.fontFamilyValue,
                })
              }
              className={cn(
                "shrink-0 px-2 py-0.5 rounded text-xs border transition-colors",
                styleConfig.fontFamilyValue === opt.fontFamilyValue
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted",
              )}
              style={{ fontFamily: opt.fontFamilyValue }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Font Size */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Size
        </span>
        <div className="flex gap-1">
          {COVER_LETTER_FONT_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ fontSize: opt.value })}
              className={cn(
                "px-2 py-0.5 rounded text-xs border transition-colors",
                styleConfig.fontSize === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Text Color */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Text
        </span>
        <div className="flex gap-1.5">
          {COVER_LETTER_TEXT_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              onClick={() => onChange({ textColor: preset.value })}
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-transform hover:scale-110",
                styleConfig.textColor === preset.value
                  ? "border-foreground scale-110 shadow-sm"
                  : "border-transparent",
              )}
              style={{ backgroundColor: preset.value }}
            />
          ))}
          <label
            className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:border-muted-foreground overflow-hidden"
            title="Custom text color"
          >
            <input
              type="color"
              value={styleConfig.textColor}
              onChange={(e) => onChange({ textColor: e.target.value })}
              className="opacity-0 absolute w-px h-px"
            />
            <span className="text-[8px] text-muted-foreground font-bold">
              +
            </span>
          </label>
        </div>
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Accent Color */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Accent
        </span>
        <div className="flex gap-1.5">
          {COVER_LETTER_ACCENT_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              onClick={() => onChange({ accentColor: preset.value })}
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-transform hover:scale-110",
                styleConfig.accentColor === preset.value
                  ? "border-foreground scale-110 shadow-sm"
                  : "border-transparent",
              )}
              style={{ backgroundColor: preset.value }}
            />
          ))}
          <label
            className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:border-muted-foreground overflow-hidden"
            title="Custom accent color"
          >
            <input
              type="color"
              value={styleConfig.accentColor}
              onChange={(e) => onChange({ accentColor: e.target.value })}
              className="opacity-0 absolute w-px h-px"
            />
            <span className="text-[8px] text-muted-foreground font-bold">
              +
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
