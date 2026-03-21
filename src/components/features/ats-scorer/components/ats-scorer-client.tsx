"use client";

/* ****** ATS Scorer — List Page Client Component ****** */

import Link from "next/link";
import { Target, AlertCircle, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ATSResultList } from "./ats-result-list";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

export function ATSScorerClient() {
    const { isProfileCompleted, isLoading: profileLoading } = useProfile();
    const { hasApiKey, isLoading: configLoading } = useAIConfig();

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-6 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/30 shrink-0">
                        <Target className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">ATS Score Checker</h1>
                        <p className="text-sm text-muted-foreground">
                            AI-powered resume scoring against any job description.
                        </p>
                    </div>
                </div>

                {/* Prerequisite warnings */}
                {!profileLoading && !isProfileCompleted && (
                    <Alert>
                        <AlertCircle className="size-4" />
                        <AlertDescription className="flex items-center justify-between gap-4">
                            <span>Complete your profile before running an ATS check.</span>
                            <Link href="/dashboard/profile">
                                <Button size="sm" variant="outline">
                                    Complete Profile
                                </Button>
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}

                {!configLoading && !hasApiKey && isProfileCompleted && (
                    <Alert>
                        <KeyRound className="size-4" />
                        <AlertDescription className="flex items-center justify-between gap-4">
                            <span>Add an AI API key from the dashboard to enable ATS scoring.</span>
                            <Link href="/dashboard">
                                <Button size="sm" variant="outline">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}

                {/* List */}
                <section>
                    <ATSResultList />
                </section>
            </main>
        </div>
    );
}
