"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FileText, Target, Sparkles, Search, Zap } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";
import { useCompanyResumes } from "@/components/features/company-resume/hooks/use-company-resumes";
import type { ATSResult } from "@/lib/db/schema";

const GENERATION_STEPS = [
    { Icon: Search, label: "Analyzing ATS feedback" },
    { Icon: Target, label: "Addressing missing keywords" },
    { Icon: FileText, label: "Rewriting resume sections" },
    { Icon: Sparkles, label: "Finalizing optimized resume" },
] as const;

interface ATSResumeGeneratorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    atsResult: ATSResult;
    onGenerated: (companyResumeId: number) => void;
}

export function ATSResumeGenerator({
    open,
    onOpenChange,
    atsResult,
    onGenerated,
}: ATSResumeGeneratorProps) {
    const { profile } = useProfile();
    const { config, getDecryptedApiKey } = useAIConfig();
    const { saveCompanyResume } = useCompanyResumes();
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleGenerate() {
        if (!profile) {
            toast.error("Profile not found.");
            return;
        }

        try {
            setIsGenerating(true);

            const apiKey = await getDecryptedApiKey();
            if (!apiKey) {
                toast.error("Could not retrieve AI key.");
                return;
            }

            const companyName = atsResult.jobTitle
                ? `ATS Optimized — ${atsResult.jobTitle}`
                : "ATS Optimized Resume";

            const response = await fetch("/api/resume/generate-company-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName,
                    jobDescription: atsResult.jobDescription,
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
                toast.error(data.error ?? "Failed to generate resume. Please try again.");
                return;
            }

            const tailored = data.resume;

            const newId = await saveCompanyResume({
                companyName,
                jobDescription: atsResult.jobDescription,
                profile: profile.profile,
                summary: tailored.summary,
                experience: tailored.experience,
                education: tailored.education,
                skills: tailored.skills,
                projects: tailored.projects,
                certifications: tailored.certifications,
                languages: tailored.languages,
            });

            toast.success("ATS-optimized resume saved to Company Resumes!");
            onGenerated(newId);
            onOpenChange(false);
        } catch {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }

    // Auto-start generation when dialog opens
    useEffect(() => {
        if (open && !isGenerating) {
            handleGenerate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 text-emerald-600">
                            <Target className="size-4" />
                        </div>
                        <div>
                            <DialogTitle>Generating ATS Resume</DialogTitle>
                            <DialogDescription>
                                AI is tailoring your resume to address the ATS feedback.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="py-6 flex flex-col items-center gap-7"
                    >
                        <div className="relative flex items-center justify-center size-36">
                            <OrbitingCircles radius={58} duration={9} iconSize={30}>
                                <FileText className="size-4 text-blue-500" />
                                <Target className="size-4 text-emerald-500" />
                                <Sparkles className="size-4 text-violet-500" />
                                <Search className="size-4 text-pink-500" />
                            </OrbitingCircles>

                            <OrbitingCircles radius={30} duration={5} reverse iconSize={22} path={false}>
                                <Zap className="size-3 text-amber-400" />
                                <Sparkles className="size-3 text-cyan-400" />
                            </OrbitingCircles>

                            <motion.div
                                animate={{
                                    scale: [1, 1.07, 1],
                                    boxShadow: [
                                        "0 0 0 0 rgba(16,185,129,0.3)",
                                        "0 0 20px 6px rgba(16,185,129,0.25)",
                                        "0 0 0 0 rgba(16,185,129,0.3)",
                                    ],
                                }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute z-10 flex items-center justify-center size-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg"
                            >
                                <Target className="size-6" />
                            </motion.div>
                        </div>

                        <div className="text-center space-y-1">
                            <p className="font-semibold text-base">Optimizing your resume…</p>
                            <p className="text-xs text-muted-foreground">
                                AI is crafting your ATS-optimized resume — this may take 15–30 seconds
                            </p>
                        </div>

                        <div className="w-full max-w-xs space-y-3">
                            {GENERATION_STEPS.map(({ Icon, label }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, x: -14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.55, duration: 0.35, ease: "easeOut" }}
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
                                    <span className="text-sm text-muted-foreground">{label}</span>
                                    {i === GENERATION_STEPS.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{
                                                delay: (GENERATION_STEPS.length - 1) * 0.55 + 0.6,
                                                duration: 1.2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="ml-auto size-2 rounded-full bg-primary"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
