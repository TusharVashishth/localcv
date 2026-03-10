/* ****** Dashboard Client Component ****** */

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Database,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { ApiKeyDialog } from "./api-key-dialog";
import { ImportDataDialog } from "./import-data-dialog";
import { useAIConfig } from "../hooks/use-ai-config";
import { useProfile } from "@/components/features/profile/hooks/use-profile";

/* ****** Step card data ****** */
const STEPS = [
  {
    step: "01",
    title: "Build Profile",
    description:
      "Add your work history, skills, and education once — reuse forever.",
    icon: UserCheck,
    gradient: "from-blue-500/15 via-cyan-500/10 to-transparent",
    borderColor: "border-blue-200/60 dark:border-blue-800/40",
    iconGradient: "from-blue-500 to-cyan-500",
    textAccent: "text-blue-600 dark:text-blue-400",
  },
  {
    step: "02",
    title: "Pick Template",
    description: "Choose from Classic, Modern, Technical, Executive and more.",
    icon: FileText,
    gradient: "from-violet-500/15 via-purple-500/10 to-transparent",
    borderColor: "border-violet-200/60 dark:border-violet-800/40",
    iconGradient: "from-violet-500 to-purple-500",
    textAccent: "text-violet-600 dark:text-violet-400",
  },
  {
    step: "03",
    title: "Download",
    description:
      "Export your resume as HTML or Markdown — print-ready and ATS-friendly.",
    icon: Download,
    gradient: "from-orange-500/15 via-amber-500/10 to-transparent",
    borderColor: "border-orange-200/60 dark:border-orange-800/40",
    iconGradient: "from-orange-500 to-amber-500",
    textAccent: "text-orange-600 dark:text-orange-400",
  },
] as const;

/* ****** Coming soon card data ****** */
const COMING_SOON = [
  {
    id: "ats",
    title: "Resume ATS Scorer",
    description:
      "Analyze your resume against ATS systems and get actionable improvement suggestions.",
    icon: Target,
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
    iconGradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "jd",
    title: "Company-wise Resume",
    description:
      "Create tailored resumes targeted to specific companies and role requirements.",
    icon: BriefcaseBusiness,
    gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
    borderColor: "border-pink-200/50 dark:border-pink-800/30",
    iconGradient: "from-violet-500 to-pink-500",
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
    else if (stepIndex === 2 && isProfileCompleted)
      router.push("/dashboard/builder");
  }

  function stepButtonLabel(stepIndex: number) {
    if (stepIndex === 0)
      return isProfileCompleted ? "Edit Profile" : "Start Profile";
    if (stepIndex === 1)
      return isProfileCompleted ? "Browse Templates" : "Complete Profile First";
    return isProfileCompleted ? "Export Resume" : "Complete Profile First";
  }

  function isStepDisabled(stepIndex: number) {
    return stepIndex === 2 && !isProfileCompleted;
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

      <main className="container mx-auto px-6 py-8 space-y-10">
        {/* ****** Hero header ****** */}
        <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/8 via-violet-500/5 to-background p-6 md:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-20 size-32 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  Build your perfect resume
                </span>
                {hasApiKey && (
                  <>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] gap-1">
                      <Sparkles className="size-2.5" />
                      AI Ready
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 h-7 text-xs px-3"
                      onClick={openApiDialog}
                    >
                      Manage Key
                    </Button>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Three steps to a professional, ATS-optimised resume — all stored
                privately on your device.
              </p>
            </div>

            {!hasApiKey && (
              <div className="shrink-0 flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 px-4 py-3">
                <KeyRound className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                    No AI key configured
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    Add a key to unlock AI features.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={openApiDialog}
                  className="ml-2 shrink-0 bg-amber-500 hover:bg-amber-600 text-white h-7 text-xs px-3"
                >
                  Add Key
                </Button>
              </div>
            )}
          </div>
        </div>

        <section className="rounded-xl border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
              <Database className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Backup Your Local Data</p>
              <p className="text-xs text-muted-foreground">
                Export your local profile and AI settings to JSON, or import a
                previous backup.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="size-3.5" />
              Import JSON
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleExportData}
              disabled={isExporting}
            >
              <Download className="size-3.5" />
              {isExporting ? "Exporting..." : "Export JSON"}
            </Button>
          </div>
        </section>

        {/* ****** 3-step cards ****** */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-semibold">Get Started</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              const done = isStepDone(index);
              const disabled = isStepDisabled(index);
              return (
                <div
                  key={s.step}
                  className={`relative overflow-hidden rounded-xl border bg-linear-to-br ${s.gradient} ${s.borderColor} p-5 flex flex-col gap-4 transition-shadow hover:shadow-md`}
                >
                  <span
                    className={`absolute top-4 right-4 text-3xl font-black opacity-10 ${s.textAccent}`}
                  >
                    {s.step}
                  </span>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center size-10 rounded-xl bg-linear-to-br ${s.iconGradient} text-white shadow-sm shrink-0`}
                    >
                      <Icon className="size-5" />
                    </div>
                    {done && (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] gap-1 h-5">
                        <CheckCircle2 className="size-2.5" />
                        Done
                      </Badge>
                    )}
                    {disabled && !done && (
                      <Lock className="size-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={done ? "outline" : disabled ? "ghost" : "default"}
                    disabled={disabled}
                    onClick={() => handleStepClick(index)}
                    className="w-full gap-1.5"
                  >
                    {stepButtonLabel(index)}
                    {!disabled && <ArrowRight className="size-3.5" />}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ****** Profile complete CTA ****** */}
        {isProfileCompleted && (
          <section className="rounded-xl border bg-linear-to-r from-primary/5 to-violet-500/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center justify-center size-9 rounded-lg bg-linear-to-br from-primary to-violet-500 text-white shrink-0">
                <Zap className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Profile complete!</p>
                <p className="text-xs text-muted-foreground">
                  You&apos;re all set — pick a template and generate your
                  resume.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="shrink-0 bg-linear-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 gap-1.5"
              onClick={() => router.push("/dashboard/builder")}
            >
              <FileText className="size-3.5" />
              Open Builder
            </Button>
          </section>
        )}

        {/* ****** Coming soon ****** */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-semibold">Coming Soon</h2>
            <Badge
              variant="outline"
              className="text-[10px] text-muted-foreground"
            >
              Roadmap
            </Badge>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMING_SOON.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`relative overflow-hidden rounded-xl border bg-linear-to-br ${card.gradient} ${card.borderColor} p-5 flex items-start gap-4`}
                >
                  <div
                    className={`flex items-center justify-center size-10 rounded-xl bg-linear-to-br ${card.iconGradient} text-white shrink-0`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{card.title}</p>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground h-4 px-1.5"
                      >
                        Soon
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
