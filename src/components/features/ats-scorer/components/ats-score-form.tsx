"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ATSScoreFormProps {
    onAnalyze: (jobTitle: string, jobDescription: string) => void;
    isAnalyzing: boolean;
    disabled?: boolean;
}

export function ATSScoreForm({ onAnalyze, isAnalyzing, disabled }: ATSScoreFormProps) {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const canSubmit = jobDescription.trim().length >= 50 && !isAnalyzing && !disabled;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        onAnalyze(jobTitle.trim(), jobDescription.trim());
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Job Title */}
                <div className="space-y-1.5">
                    <Label htmlFor="jobTitle" className="text-sm font-medium">
                        Job Title{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Input
                        id="jobTitle"
                        placeholder="e.g. Senior Software Engineer, Product Manager…"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        disabled={isAnalyzing || disabled}
                        className="h-9"
                    />
                </div>

                {/* Job Description */}
                <div className="space-y-1.5">
                    <Label htmlFor="jobDescription" className="text-sm font-medium">
                        Job Description{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="jobDescription"
                        placeholder="Paste the full job description here — the more detail, the better the ATS analysis…"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        disabled={isAnalyzing || disabled}
                        className="min-h-52 max-h-96 resize-y text-sm leading-relaxed"
                    />
                    <p className="text-[11px] text-muted-foreground">
                        {jobDescription.trim().length < 50
                            ? `Minimum 50 characters required (${jobDescription.trim().length}/50)`
                            : `${jobDescription.trim().length} characters`}
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full gap-2 h-10"
                    size="default"
                >
                    {isAnalyzing ? (
                        <>
                            <Sparkles className="size-4 animate-pulse" />
                            Analyzing…
                        </>
                    ) : (
                        <>
                            <FileSearch className="size-4" />
                            Analyze ATS Score
                            <Target className="size-4 ml-auto" />
                        </>
                    )}
                </Button>
            </form>
        </motion.div>
    );
}
