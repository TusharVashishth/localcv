"use client";

/* ****** ATS Scorer — List Page Client Component ****** */

import Link from "next/link";
import { ArrowLeft, Target, AlertCircle, KeyRound, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { ATSResultList } from "./ats-result-list";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

export function ATSScorerClient() {
  const { isProfileCompleted, isLoading: profileLoading } = useProfile();
  const { hasApiKey, isLoading: configLoading } = useAIConfig();

  const showProfileAlert = !profileLoading && !isProfileCompleted;
  const showKeyAlert = !configLoading && !hasApiKey && isProfileCompleted;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-6 max-w-5xl">

        {/* ****** Back nav ****** */}
        <BlurFade delay={0} direction="up">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2">
                <ArrowLeft className="size-3.5" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* ****** Hero banner ****** */}
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-background border-emerald-200/50 dark:border-emerald-800/30 p-5 md:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-teal-500/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 left-8 size-32 rounded-full bg-emerald-500/8 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center justify-center size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shrink-0 shadow-md shadow-emerald-500/25">
                  <Target className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h1 className="text-xl font-bold tracking-tight">ATS Score Checker</h1>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1">
                      <Zap className="size-2.5" />
                      AI Powered
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Score your resume against any job description and fix the gaps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* ****** Prerequisite alerts ****** */}
        {(showProfileAlert || showKeyAlert) && (
          <BlurFade delay={0.08} direction="up">
            <div className="space-y-3">
              {showProfileAlert && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/25 px-4 py-3">
                  <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200 flex-1">
                    Complete your profile before running an ATS check.
                  </p>
                  <Link href="/dashboard/profile">
                    <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              )}

              {showKeyAlert && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/25 px-4 py-3">
                  <KeyRound className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200 flex-1">
                    Add an AI API key to enable ATS scoring.
                  </p>
                  <Link href="/dashboard">
                    <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs">
                      Add API Key
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </BlurFade>
        )}

        {/* ****** List ****** */}
        <BlurFade delay={0.12} direction="up">
          <ATSResultList />
        </BlurFade>

      </main>
    </div>
  );
}
