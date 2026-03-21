"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import type { ATSResult } from "@/lib/db/schema";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

export type ATSAnalysis = Omit<ATSResult, "id" | "createdAt" | "generatedResume">;

interface UseATSScorerReturn {
    isAnalyzing: boolean;
    result: ATSResult | null;
    analyze: (jobTitle: string, jobDescription: string) => Promise<void>;
    reset: () => void;
}

export function useATSScorer(): UseATSScorerReturn {
    const { profile } = useProfile();
    const { config, getDecryptedApiKey } = useAIConfig();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ATSResult | null>(null);

    const analyze = useCallback(
        async (jobTitle: string, jobDescription: string) => {
            if (!profile) {
                toast.error("Please complete your profile first.");
                return;
            }

            try {
                setIsAnalyzing(true);

                const apiKey = await getDecryptedApiKey();
                if (!apiKey) {
                    toast.error("Could not retrieve AI key. Please reconfigure it in the dashboard.");
                    return;
                }

                const response = await fetch("/api/resume/ats-score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jobTitle: jobTitle || undefined,
                        jobDescription,
                        profileData: {
                            profile: profile.profile,
                            summary: profile.summary,
                            experience: profile.experience,
                            education: profile.education,
                            skills: profile.skills,
                            projects: profile.projects,
                            certifications: profile.certifications,
                            languages: profile.languages,
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
                    toast.error(data.error ?? "Failed to analyze resume. Please try again.");
                    return;
                }

                const now = new Date();
                const atsResult: ATSResult = {
                    ...data.analysis,
                    jobTitle: jobTitle || undefined,
                    jobDescription,
                    createdAt: now,
                };

                // Save to Dexie
                const savedId = await db.atsResults.add(atsResult);
                const savedResult = await db.atsResults.get(savedId as number);

                setResult(savedResult ?? atsResult);
                toast.success("ATS analysis complete!");
            } catch {
                toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setIsAnalyzing(false);
            }
        },
        [profile, config, getDecryptedApiKey],
    );

    const reset = useCallback(() => {
        setResult(null);
    }, []);

    return { isAnalyzing, result, analyze, reset };
}
