/* ****** Dashboard Client Component ****** */

"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Target,
  BriefcaseBusiness,
  Plus,
  Settings,
  KeyRound,
} from "lucide-react";
import { ApiKeyDialog } from "./api-key-dialog";
import { useAIConfig } from "../hooks/use-ai-config";
import { ResumeCard } from "./resume-card";
import { RESUME_TEMPLATES } from "@/components/features/resume-templates";

const DASHBOARD_CARDS = [
  {
    id: "builder",
    title: "Resume Builder",
    description:
      "Create a professional resume from scratch with our guided builder and AI assistance.",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "ats",
    title: "Resume ATS Scorer",
    description:
      "Analyze your resume against ATS systems and get actionable improvement suggestions.",
    icon: Target,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "jd",
    title: "Resume from Job Description",
    description:
      "Generate a tailored resume optimized for a specific job description using AI.",
    icon: BriefcaseBusiness,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
] as const;

export function DashboardClient() {
  const { hasApiKey, isLoading: configLoading, saveConfig } = useAIConfig();
  const resumes = useLiveQuery(() =>
    db.resumes.orderBy("updatedAt").reverse().toArray(),
  );

  const handleSaveConfig = useCallback(
    async (provider: string, modelName: string, apiKey: string) => {
      await saveConfig(provider, modelName, apiKey);
    },
    [saveConfig],
  );

  const handleDeleteResume = useCallback(async (id: number) => {
    await db.resumes.delete(id);
  }, []);

  const handleEditResume = useCallback((id: number) => {
    /* ****** TODO: navigate to editor ****** */
    console.log("Edit resume", id);
  }, []);

  /* ****** Show nothing while checking config ****** */
  // if (configLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[60vh]">
  //       <div className="animate-pulse text-muted-foreground">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* ****** API Key Dialog ****** */}
      <ApiKeyDialog open={!hasApiKey} onSave={handleSaveConfig} />

      {/* ****** Header ****** */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Build, score, and tailor your resumes with AI
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <Settings data-icon="inline-start" />
            Settings
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* ****** Feature Cards ****** */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DASHBOARD_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.id}
                  className="cursor-pointer hover:ring-primary/30 transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div
                        className={`${card.bgColor} ${card.color} rounded-lg p-2.5`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {card.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus data-icon="inline-start" />
                      {card.id === "ats" ? "Score Resume" : "Create Resume"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ****** Templates Preview ****** */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESUME_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className="hover:ring-primary/30 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-muted rounded-lg p-2.5">
                      <FileText className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="mt-0.5">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* ****** Previous Resumes ****** */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Resumes</h2>
            {resumes && resumes.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {!resumes || resumes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-muted rounded-full p-4 mb-4">
                  <FileText className="size-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No resumes yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Get started by creating your first resume using one of the
                  options above.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEditResume}
                  onDelete={handleDeleteResume}
                />
              ))}
            </div>
          )}
        </section>

        {/* ****** AI Config indicator ****** */}
        {hasApiKey && (
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <KeyRound className="size-3" />
            <span>AI model configured</span>
          </div>
        )}
      </main>
    </div>
  );
}
