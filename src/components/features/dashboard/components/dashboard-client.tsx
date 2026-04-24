/* ****** Dashboard Client Component ****** */

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { createLocalDataExport } from "@/lib/db/import-export";
import {
  FileText,
  Target,
  BriefcaseBusiness,
  KeyRound,
  Sparkles,
  UserCheck,
  Download,
  Upload,
  CheckCircle2,
  Lock,
  Zap,
  ShieldCheck,
  HardDrive,
  MailOpen,
  ChevronRight,
  Cloud,
} from "lucide-react";
import { ApiKeyDialog } from "./api-key-dialog";
import { ImportDataDialog } from "./import-data-dialog";
import { useAIConfig } from "../hooks/use-ai-config";
import { useProfile } from "@/components/features/profile/hooks/use-profile";

import { GoogleDriveSyncButton } from "./google-drive-sync-button";

/* ****** Step card data ****** */
const STEPS = [
  {
    step: "01",
    title: "Build Your Profile",
    description:
      "Add work history, skills, and education once — reuse across every resume forever.",
    icon: UserCheck,
    accent: "teal",
    gradient: "from-primary/12 via-primary/5 to-transparent",
    border: "border-primary/20 dark:border-primary/15",
    iconBg: "from-primary to-emerald-500",
    iconShadow: "shadow-primary/25",
    badgeClass:
      "bg-primary/10 text-primary border-primary/20 dark:border-primary/30",
    textAccent: "text-primary",
    stepColor: "text-primary/20 dark:text-primary/15",
  },
  {
    step: "02",
    title: "Pick Template & Build Resume",
    description:
      "Choose from Classic, Modern, Technical, Executive and more — export as PDF instantly.",
    icon: FileText,
    accent: "violet",
    gradient: "from-violet-500/12 via-violet-500/5 to-transparent",
    border: "border-violet-500/20 dark:border-violet-500/15",
    iconBg: "from-violet-500 to-purple-600",
    iconShadow: "shadow-violet-500/25",
    badgeClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    textAccent: "text-violet-600 dark:text-violet-400",
    stepColor: "text-violet-500/20 dark:text-violet-400/15",
  },
] as const;

/* ****** AI feature cards ****** */
const AI_FEATURES = [
  {
    key: "company",
    title: "Company-wise Resume",
    description:
      "Generate AI-tailored resumes targeted to specific companies and role requirements.",
    icon: BriefcaseBusiness,
    iconBg: "from-violet-500 to-pink-500",
    iconShadow: "shadow-violet-500/30",
    gradient: "from-violet-500/8 via-pink-500/5 to-transparent",
    border: "border-violet-200/60 dark:border-violet-800/30",
    badge:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    glow: "bg-pink-500/8 dark:bg-pink-500/5",
    route: "/dashboard/company-resumes",
    label: "Open Company Resumes",
  },
  {
    key: "ats",
    title: "ATS Score Checker",
    description:
      "Paste a job description to get ATS compatibility score, keyword gaps, and fix suggestions.",
    icon: Target,
    iconBg: "from-emerald-500 to-teal-500",
    iconShadow: "shadow-emerald-500/30",
    gradient: "from-emerald-500/8 via-teal-500/5 to-transparent",
    border: "border-emerald-200/60 dark:border-emerald-800/30",
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    glow: "bg-teal-500/8 dark:bg-teal-500/5",
    route: "/dashboard/ats-scorer",
    label: "Check ATS Score",
  },
  {
    key: "cover",
    title: "Cover Letter Generator",
    description:
      "Craft personalised, compelling cover letters for any job in seconds using AI.",
    icon: MailOpen,
    iconBg: "from-orange-500 to-amber-500",
    iconShadow: "shadow-orange-500/30",
    gradient: "from-orange-500/8 via-amber-500/5 to-transparent",
    border: "border-orange-200/60 dark:border-orange-800/30",
    badge:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    glow: "bg-amber-500/8 dark:bg-amber-500/5",
    route: "/dashboard/company-resumes",
    label: "Generate Cover Letter",
  },
] as const;

export function DashboardClient() {
  const router = useRouter();
  const { config, hasApiKey, saveConfig, getDecryptedApiKey } = useAIConfig();
  const { isProfileCompleted } = useProfile();
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [initialProvider, setInitialProvider] = useState("");
  const [initialModel, setInitialModel] = useState("");
  const [initialApiKey, setInitialApiKey] = useState("");

  const handleSaveConfig = useCallback(
    async (provider: string, modelName: string, apiKey: string) => {
      await saveConfig(provider, modelName, apiKey);
    },
    [saveConfig],
  );

  const openApiDialog = useCallback(async () => {
    if (hasApiKey && config) {
      try {
        const key = await getDecryptedApiKey();
        setInitialProvider(config.provider ?? "");
        setInitialModel(config.modelName ?? "");
        setInitialApiKey(key ?? "");
      } catch {
        setInitialProvider(config.provider ?? "");
        setInitialModel(config.modelName ?? "");
        setInitialApiKey("");
      }
    } else {
      setInitialProvider("");
      setInitialModel("");
      setInitialApiKey("");
    }
    setIsApiDialogOpen(true);
  }, [hasApiKey, config, getDecryptedApiKey]);

  function handleStepClick(stepIndex: number) {
    if (stepIndex === 0) router.push("/dashboard/profile");
    else if (stepIndex === 1)
      router.push(
        isProfileCompleted ? "/dashboard/builder" : "/dashboard/profile",
      );
  }

  function stepButtonLabel(stepIndex: number) {
    if (stepIndex === 0)
      return isProfileCompleted ? "Edit Profile" : "Start Profile";
    if (stepIndex === 1)
      return isProfileCompleted ? "Browse Templates" : "Complete Profile First";
    return "Complete Profile First";
  }

  function isStepDisabled(stepIndex: number) {
    return stepIndex === 1 && !isProfileCompleted;
  }

  function isStepDone(stepIndex: number) {
    return stepIndex === 0 && isProfileCompleted;
  }

  const handleExportData = useCallback(async () => {
    try {
      setIsExporting(true);
      const payload = await createLocalDataExport();
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const dateToken = new Date().toISOString().replace(/[:.]/g, "-");
      anchor.href = url;
      anchor.download = `localcv-backup-${dateToken}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Local data exported as JSON.");
    } catch {
      toast.error("Unable to export local data.");
    } finally {
      setIsExporting(false);
    }
  }, []);

  const completionPercent = isProfileCompleted ? (hasApiKey ? 100 : 66) : 33;

  return (
    <div className="min-h-screen bg-background">
      <ApiKeyDialog
        open={isApiDialogOpen}
        onOpenChange={setIsApiDialogOpen}
        onSave={handleSaveConfig}
        initialProvider={initialProvider}
        initialModel={initialModel}
        initialApiKey={initialApiKey}
      />
      <ImportDataDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-5xl">
        {/* ****** Hero header ****** */}
        <BlurFade delay={0} direction="up">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/4 to-background border-primary/20 dark:border-primary/15 p-6 md:p-8">
            <BorderBeam
              colorFrom="#2dd4bf"
              colorTo="#818cf8"
              duration={6}
              borderWidth={1.5}
            />

            {/* Ambient blobs */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-16 size-40 rounded-full bg-violet-500/8 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Left: title + badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-violet-500 bg-clip-text text-transparent">
                    Build your perfect resume
                  </h1>
                  <Badge className="bg-primary/10 text-primary border-primary/25 text-[10px] gap-1 shrink-0">
                    <ShieldCheck className="size-3" />
                    100% Local
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Privacy-first AI resume builder — your data never leaves your
                  device.
                </p>

                {/* Progress indicator */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 max-w-[180px] h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercent}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {completionPercent}% setup complete
                  </span>
                </div>
              </div>

              {/* Right: AI key status */}
              <div className="shrink-0">
                {hasApiKey ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="flex items-center gap-3 rounded-xl border border-primary/20 dark:border-primary/15 bg-primary/6 dark:bg-primary/8 px-4 py-3"
                  >
                    <div className="flex items-center justify-center size-8 rounded-lg bg-primary/15 text-primary">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">
                        AI Ready
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {config?.provider ?? "Configured"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-1 h-7 text-xs px-3"
                      onClick={openApiDialog}
                    >
                      Manage
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/25 px-4 py-3"
                  >
                    <div className="flex items-center justify-center size-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                      <KeyRound className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                        No AI key
                      </p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">
                        Required for AI features
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={openApiDialog}
                      className="ml-1 h-7 text-xs px-3 bg-amber-500 hover:bg-amber-600 text-white border-0"
                    >
                      Add Key
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </BlurFade>

        {/* ****** Get Started steps ****** */}
        <BlurFade delay={0.1} direction="up">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Get Started
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STEPS.map((s, index) => {
                const Icon = s.icon;
                const done = isStepDone(index);
                const disabled = isStepDisabled(index);

                return (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + index * 0.08,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={
                      !disabled
                        ? { y: -3, transition: { duration: 0.18 } }
                        : undefined
                    }
                    className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${s.gradient} ${s.border} p-5 flex flex-col gap-4 transition-all duration-200 ${
                      !disabled
                        ? "cursor-pointer hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
                        : "opacity-60"
                    }`}
                    onClick={
                      !disabled ? () => handleStepClick(index) : undefined
                    }
                  >
                    {/* Step watermark */}
                    <span
                      className={`absolute top-4 right-4 text-5xl font-black ${s.stepColor} select-none transition-transform duration-300 group-hover:scale-110`}
                    >
                      {s.step}
                    </span>

                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: -4 }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-center justify-center size-10 rounded-xl bg-gradient-to-br ${s.iconBg} text-white shadow-md ${s.iconShadow} shrink-0`}
                      >
                        <Icon className="size-5" />
                      </motion.div>

                      <div className="flex items-center gap-2">
                        {done && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Badge className="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40 text-[10px] gap-1 h-5">
                              <CheckCircle2 className="size-2.5" />
                              Complete
                            </Badge>
                          </motion.div>
                        )}
                        {disabled && (
                          <Lock className="size-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      <p className="font-semibold text-sm mb-1">{s.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        done
                          ? s.textAccent
                          : disabled
                            ? "text-muted-foreground"
                            : s.textAccent
                      }`}
                    >
                      {stepButtonLabel(index)}
                      {!disabled && (
                        <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </BlurFade>

        {/* ****** AI Feature cards ****** */}
        <BlurFade delay={0.2} direction="up">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                AI Features
              </h2>
              <div className="h-px flex-1 bg-border" />
              {!hasApiKey && (
                <button
                  onClick={openApiDialog}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <KeyRound className="size-3" /> Add AI key to unlock
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AI_FEATURES.map((f, index) => {
                const Icon = f.icon;
                const locked = !isProfileCompleted || !hasApiKey;

                return (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.25 + index * 0.07,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={
                      !locked
                        ? { y: -3, transition: { duration: 0.18 } }
                        : undefined
                    }
                    className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${f.gradient} ${f.border} p-5 flex flex-col gap-3.5 transition-all duration-200 ${
                      !locked
                        ? "cursor-pointer hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
                        : "opacity-55"
                    }`}
                    onClick={!locked ? () => router.push(f.route) : undefined}
                  >
                    {/* Ambient glow */}
                    <div
                      className={`pointer-events-none absolute -right-6 -top-6 size-24 rounded-full ${f.glow} blur-2xl`}
                    />

                    <div className="flex items-start justify-between gap-2 relative">
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: -4 }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-center justify-center size-10 rounded-xl bg-gradient-to-br ${f.iconBg} text-white shrink-0 shadow-md ${f.iconShadow}`}
                      >
                        <Icon className="size-5" />
                      </motion.div>

                      {locked ? (
                        <Lock className="size-3.5 text-muted-foreground shrink-0 mt-1" />
                      ) : (
                        <Badge
                          className={`${f.badge} text-[10px] gap-1 h-5 shrink-0`}
                        >
                          <Zap className="size-2.5" />
                          AI
                        </Badge>
                      )}
                    </div>

                    <div className="relative flex-1">
                      <p className="text-sm font-semibold mb-1">{f.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between relative">
                      <span className="text-xs font-medium text-muted-foreground">
                        {!isProfileCompleted
                          ? "Complete profile first"
                          : !hasApiKey
                            ? "Add AI key first"
                            : f.label}
                      </span>
                      {!locked && (
                        <ChevronRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </BlurFade>

        {/* ****** Backup section ****** */}
        <BlurFade delay={0.3} direction="up">
          <section className="rounded-xl border bg-muted/30 dark:bg-muted/15 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-shadow hover:shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center justify-center size-8 rounded-lg bg-background border shrink-0">
                <HardDrive className="size-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Backup & Restore</p>
                <p className="text-xs text-muted-foreground truncate">
                  Export your profile and settings to JSON, or import a backup.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="size-3" />
                Import
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                onClick={handleExportData}
                disabled={isExporting}
              >
                <Download className="size-3" />
                {isExporting ? "Exporting…" : "Export"}
              </Button>
            </div>
          </section>
        </BlurFade>

        {/* ****** Cloud Sync section ****** */}
        <BlurFade delay={0.4} direction="up">
          <section className="rounded-xl border bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-shadow hover:shadow-sm mt-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center justify-center size-8 rounded-lg bg-background border border-indigo-200 dark:border-indigo-800 shrink-0">
                <Cloud className="size-3.5 text-indigo-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Cloud Sync</p>
                <p className="text-xs text-indigo-700/70 dark:text-indigo-300/70 truncate">
                  Automatically sync your data to your personal Google Drive for multi-device access.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <GoogleDriveSyncButton />
            </div>
          </section>
        </BlurFade>
      </main>
    </div>
  );
}
