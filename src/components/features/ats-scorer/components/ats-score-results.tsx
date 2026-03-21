"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ATSResult } from "@/lib/db/schema";

/* ****** Score ring — animated SVG circle ****** */
function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color =
    score >= 70
      ? "#10b981" // emerald-500
      : score >= 40
        ? "#f59e0b" // amber-500
        : "#ef4444"; // red-500

  const label =
    score >= 70 ? "Great Match" : score >= 40 ? "Needs Work" : "Poor Match";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center size-36">
        <svg className="-rotate-90 size-36" viewBox="0 0 128 128">
          {/* Track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/30"
          />
          {/* Progress */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-3xl font-black leading-none"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground font-medium">
            /100
          </span>
        </div>
      </div>
      <Badge
        className="text-[11px]"
        style={{
          backgroundColor: `${color}20`,
          color,
          borderColor: `${color}40`,
        }}
      >
        {label}
      </Badge>
    </div>
  );
}

/* ****** Single breakdown bar ****** */
function BreakdownBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const color =
    value >= 70
      ? "bg-emerald-500"
      : value >= 40
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
}

/* ****** Collapsible section feedback accordion ****** */
function SectionAccordion({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-muted/40 transition-colors text-left"
      >
        {label}
        {open ? (
          <ChevronUp className="size-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed border-t bg-muted/20"
        >
          <p className="pt-2">{content}</p>
        </motion.div>
      )}
    </div>
  );
}

interface ATSScoreResultsProps {
  result: ATSResult;
  onReset: () => void;
  onGenerateResume: () => void;
  isGenerating: boolean;
  hideResetButton?: boolean;
}

export function ATSScoreResults({
  result,
  onReset,
  onGenerateResume,
  isGenerating,
  hideResetButton = false,
}: ATSScoreResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold text-base">ATS Analysis Results</h3>
          {result.jobTitle && (
            <p className="text-xs text-muted-foreground mt-0.5">
              for{" "}
              <span className="font-medium text-foreground">
                {result.jobTitle}
              </span>
            </p>
          )}
        </div>
        {!hideResetButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-1.5 shrink-0"
          >
            <RotateCcw className="size-3.5" />
            New Analysis
          </Button>
        )}
      </div>

      {/* Score + Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-xl border bg-card p-5">
        {/* Overall Score Ring */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
            Overall ATS Score
          </p>
          <ScoreRing score={result.score} />
        </div>

        {/* Sub-score bars */}
        <div className="flex flex-col justify-center gap-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Score Breakdown
          </p>
          <BreakdownBar
            label="Keyword Match"
            value={result.scoreBreakdown.keywordMatch}
            delay={0.3}
          />
          <BreakdownBar
            label="Experience Relevance"
            value={result.scoreBreakdown.experienceRelevance}
            delay={0.45}
          />
          <BreakdownBar
            label="Skills Match"
            value={result.scoreBreakdown.skillsMatch}
            delay={0.6}
          />
          <BreakdownBar
            label="Format Quality"
            value={result.scoreBreakdown.formatQuality}
            delay={0.75}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Matched */}
        <div className="rounded-xl border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-800/40 p-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Matched Keywords
            </p>
            <Badge className="ml-auto bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px]">
              {result.matchedKeywords.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedKeywords.length > 0 ? (
              result.matchedKeywords.map((kw) => (
                <Badge
                  key={kw}
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-700/50 text-[11px] font-normal"
                >
                  {kw}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No keywords matched.
              </p>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="rounded-xl border bg-red-500/5 dark:bg-red-500/10 border-red-200/60 dark:border-red-800/40 p-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            <XCircle className="size-4 text-red-500" />
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Missing Keywords
            </p>
            <Badge className="ml-auto bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 text-[10px]">
              {result.missingKeywords.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.missingKeywords.length > 0 ? (
              result.missingKeywords.map((kw) => (
                <Badge
                  key={kw}
                  className="bg-red-500/10 text-red-700 dark:text-red-300 border-red-200/70 dark:border-red-700/50 text-[11px] font-normal"
                >
                  {kw}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No missing keywords found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="size-4 text-blue-500" />
            <p className="text-sm font-semibold">Strengths</p>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
                className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
              >
                <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                {s}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            <AlertTriangle className="size-4 text-amber-500" />
            <p className="text-sm font-semibold">Improvements</p>
          </div>
          <ul className="space-y-2">
            {result.improvements.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
                className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
              >
                <AlertTriangle className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section Feedback */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Section Feedback</p>
        <div className="space-y-2">
          <SectionAccordion
            label="Summary"
            content={result.sectionFeedback.summary}
          />
          <SectionAccordion
            label="Experience"
            content={result.sectionFeedback.experience}
          />
          <SectionAccordion
            label="Skills"
            content={result.sectionFeedback.skills}
          />
          <SectionAccordion
            label="Education"
            content={result.sectionFeedback.education}
          />
        </div>
      </div>

      {/* Generate ATS Resume CTA */}
      {!result.generatedResume ? (
        <div className="rounded-xl border bg-linear-to-br from-violet-500/10 via-pink-500/5 to-transparent border-violet-200/50 dark:border-violet-800/30 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
              Generate ATS-Optimized Resume
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Let AI rewrite your resume to address the missing keywords and
              improvements above.
            </p>
          </div>
          <Button
            onClick={onGenerateResume}
            disabled={isGenerating}
            className="shrink-0 gap-2 bg-linear-to-r from-violet-500 to-pink-500 text-white border-0 hover:opacity-90"
            size="sm"
          >
            <Wand2 className="size-4" />
            {isGenerating ? "Generating…" : "Generate Resume"}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-800/30 p-4 flex items-center gap-3">
          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              ATS Resume Generated
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Saved to Company Resumes — you can view and download it from
              there.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
