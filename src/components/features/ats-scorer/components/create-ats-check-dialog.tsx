"use client";

/* ****** Dialog to run a new ATS score check via AI ****** */

import { useState } from "react";
import { toast } from "sonner";
import { Target, FileSearch, BarChart2, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { db } from "@/lib/db";
import type { ATSResult } from "@/lib/db/schema";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

const ANALYSIS_STEPS = [
    { Icon: FileSearch, label: "Reading job description" },
    { Icon: Target, label: "Matching keywords & skills" },
    { Icon: BarChart2, label: "Scoring each section" },
    { Icon: Sparkles, label: "Generating detailed feedback" },
] as const;

interface CreateATSCheckDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: (result: ATSResult) => void;
}

export function CreateATSCheckDialog({
    open,
    onOpenChange,
    onCreated,
}: CreateATSCheckDialogProps) {
    const { profile, isProfileCompleted } = useProfile();
    const { config, hasApiKey, getDecryptedApiKey } = useAIConfig();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const canAnalyze = isProfileCompleted && hasApiKey;
    const canSubmit = jobDescription.trim().length >= 50 && !isAnalyzing && canAnalyze;

    function handleDialogOpenChange(next: boolean) {
        if (isAnalyzing) return; // block closing while running
        if (!next) {
            setJobTitle("");
            setJobDescription("");
        }
        onOpenChange(next);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit || !profile) return;

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
                    jobTitle: jobTitle.trim() || undefined,
                    jobDescription: jobDescription.trim(),
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
                jobTitle: jobTitle.trim() || undefined,
                jobDescription: jobDescription.trim(),
                createdAt: now,
            };

            const savedId = await db.atsResults.add(atsResult);
            const saved = await db.atsResults.get(savedId as number);

            toast.success("ATS analysis complete!");
            setJobTitle("");
            setJobDescription("");
            onOpenChange(false);
            onCreated?.(saved ?? atsResult);
        } catch {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange} disablePointerDismissal>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Target className="size-4" />
                        </div>
                        <div>
                            <DialogTitle>New ATS Check</DialogTitle>
                            <DialogDescription>
                                Paste a job description and AI will score your resume against it.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {isAnalyzing ? (
                        /* Loading state */
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="py-6 flex flex-col items-center gap-7"
                        >
                            <div className="relative flex items-center justify-center size-36">
                                <OrbitingCircles radius={58} duration={10} iconSize={30}>
                                    <FileSearch className="size-4 text-blue-500" />
                                    <Target className="size-4 text-emerald-500" />
                                    <BarChart2 className="size-4 text-violet-500" />
                                    <Sparkles className="size-4 text-pink-500" />
                                </OrbitingCircles>

                                <OrbitingCircles radius={30} duration={6} reverse iconSize={22} path={false}>
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
                                <p className="font-semibold text-base">Analyzing your resume…</p>
                                <p className="text-xs text-muted-foreground">
                                    AI is scoring your profile against the job description — this may take 15–30 seconds
                                </p>
                            </div>

                            <div className="w-full max-w-xs space-y-3">
                                {ANALYSIS_STEPS.map(({ Icon, label }, i) => (
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
                                        {i === ANALYSIS_STEPS.length - 1 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{
                                                    delay: (ANALYSIS_STEPS.length - 1) * 0.55 + 0.6,
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
                    ) : (
                        /* Form state */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {!isProfileCompleted && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>
                                        Please complete your profile before running an ATS check.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {isProfileCompleted && !hasApiKey && (
                                <Alert className="mb-4">
                                    <AlertDescription>
                                        No AI key configured. Add an API key from the dashboard to enable ATS scoring.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <ScrollArea className="max-h-[55vh] px-1">
                                <form onSubmit={handleSubmit} className="space-y-4 p-1">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ats-jobTitle">
                                            Job Title{" "}
                                            <span className="text-muted-foreground font-normal">(optional)</span>
                                        </Label>
                                        <Input
                                            id="ats-jobTitle"
                                            placeholder="e.g. Senior Software Engineer, Product Manager…"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            disabled={!canAnalyze}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="ats-jobDescription">
                                            Job Description <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="ats-jobDescription"
                                            placeholder="Paste the full job description here — the more detail, the better the ATS analysis…"
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            disabled={!canAnalyze}
                                            className="min-h-48 max-h-64 resize-none"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            {jobDescription.trim().length < 50
                                                ? `Minimum 50 characters required (${jobDescription.trim().length}/50)`
                                                : `${jobDescription.trim().length} characters`}
                                        </p>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleDialogOpenChange(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={!canSubmit} className="gap-2">
                                            <Target className="size-4" />
                                            Analyze ATS Score
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </ScrollArea>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
