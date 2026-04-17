"use client";

/* ****** Card for a single saved ATS result entry ****** */

import { motion } from "framer-motion";
import { Eye, Trash2, FileCheck2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ATSResult } from "@/lib/db/schema";

function scoreColor(score: number) {
  if (score >= 70) return { hex: "#10b981", bar: "bg-emerald-500" };
  if (score >= 40) return { hex: "#f59e0b", bar: "bg-amber-500" };
  return { hex: "#ef4444", bar: "bg-red-500" };
}

function scoreLabel(score: number) {
  if (score >= 70) return { text: "Great Match", cls: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40" };
  if (score >= 40) return { text: "Needs Work", cls: "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40" };
  return { text: "Poor Match", cls: "bg-red-500/12 text-red-600 dark:text-red-400 border-red-200/60 dark:border-red-800/40" };
}

interface ATSResultCardProps {
  result: ATSResult;
  onView: (result: ATSResult) => void;
  onDelete: (id: number) => Promise<void>;
}

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ATSResultCard({ result, onView, onDelete }: ATSResultCardProps) {
  const { hex, bar } = scoreColor(result.score);
  const { text: labelText, cls: labelCls } = scoreLabel(result.score);
  const strokeDashoffset = CIRCUMFERENCE - (result.score / 100) * CIRCUMFERENCE;

  const jdPreview =
    result.jobDescription.length > 100
      ? result.jobDescription.slice(0, 100) + "…"
      : result.jobDescription;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(result.createdAt));

  const breakdown = [
    { label: "Keywords", value: result.scoreBreakdown.keywordMatch },
    { label: "Experience", value: result.scoreBreakdown.experienceRelevance },
    { label: "Skills", value: result.scoreBreakdown.skillsMatch },
    { label: "Format", value: result.scoreBreakdown.formatQuality },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-emerald-500/8 via-teal-500/4 to-transparent border-emerald-200/50 dark:border-emerald-800/30 p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/8 dark:hover:shadow-emerald-500/5 cursor-pointer"
      onClick={() => onView(result)}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-teal-500/6 blur-2xl" />

      {/* ****** Header: score ring + title + date ****** */}
      <div className="flex items-start gap-3 relative">
        {/* Animated score ring */}
        <div className="relative flex items-center justify-center size-12 shrink-0">
          <svg className="-rotate-90 size-12" viewBox="0 0 52 52">
            <circle
              cx="26" cy="26" r={RADIUS}
              fill="none" stroke="currentColor" strokeWidth="4.5"
              className="text-muted/25 dark:text-muted/20"
            />
            <motion.circle
              cx="26" cy="26" r={RADIUS}
              fill="none" stroke={hex} strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
          </svg>
          <span className="absolute text-[11px] font-black leading-none tabular-nums" style={{ color: hex }}>
            {result.score}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
            {result.jobTitle || "ATS Analysis"}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <Badge className={`text-[10px] h-4 px-1.5 ${labelCls}`}>
              {labelText}
            </Badge>
            {result.generatedResume && (
              <Badge className="text-[10px] h-4 px-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/40 gap-0.5">
                <FileCheck2 className="size-2.5" />
                Resume
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <CalendarDays className="size-3 shrink-0" />
            <p className="text-[11px]">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* ****** JD preview ****** */}
      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 relative">
        {jdPreview}
      </p>

      {/* ****** Score breakdown bars ****** */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 relative">
        {breakdown.map(({ label, value }) => {
          const { bar: barCls } = scoreColor(value);
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{label}</span>
                <span className="font-semibold tabular-nums">{value}</span>
              </div>
              <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barCls}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ****** Actions ****** */}
      <div className="flex items-center justify-between gap-2 mt-auto relative" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 h-8 text-xs"
          onClick={() => onView(result)}
        >
          <Eye className="size-3.5" />
          View Analysis
        </Button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                size="sm"
                variant="ghost"
                className="gap-1 h-8 px-2.5 text-[11px] text-muted-foreground hover:text-destructive hover:bg-destructive/8"
              />
            }
          >
            <Trash2 className="size-3" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete ATS Analysis?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the ATS analysis
                {result.jobTitle ? <> for <span className="font-semibold">{result.jobTitle}</span></> : ""}.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => result.id && onDelete(result.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}
