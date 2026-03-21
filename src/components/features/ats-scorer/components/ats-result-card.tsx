"use client";

/* ****** Card for a single saved ATS result entry ****** */

import { Eye, Trash2, FileCheck2, Wand2 } from "lucide-react";
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

function ScoreBadgeColor(score: number) {
  if (score >= 70)
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
  if (score >= 40)
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
}

function ScoreLabel(score: number) {
  if (score >= 70) return "Great Match";
  if (score >= 40) return "Needs Work";
  return "Poor Match";
}

interface ATSResultCardProps {
  result: ATSResult;
  onView: (result: ATSResult) => void;
  onDelete: (id: number) => Promise<void>;
}

export function ATSResultCard({
  result,
  onView,
  onDelete,
}: ATSResultCardProps) {
  const truncatedJD =
    result.jobDescription.length > 110
      ? result.jobDescription.slice(0, 110) + "…"
      : result.jobDescription;

  const scoreColor =
    result.score >= 70 ? "#10b981" : result.score >= 40 ? "#f59e0b" : "#ef4444";

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-emerald-500/8 via-teal-500/5 to-transparent border-emerald-200/50 dark:border-emerald-800/30 p-5 flex flex-col gap-4 transition-shadow hover:shadow-md">
      {/* Header: mini score ring + title + date */}
      <div className="flex items-start gap-3">
        {/* Mini score ring */}
        <div className="relative flex items-center justify-center size-12 shrink-0">
          <svg className="-rotate-90 size-12" viewBox="0 0 52 52">
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-muted/30"
            />
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span
            className="absolute text-[11px] font-black leading-none"
            style={{ color: scoreColor }}
          >
            {result.score}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm truncate">
            {result.jobTitle || "ATS Analysis"}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge
              className={`text-[10px] h-4 px-1.5 ${ScoreBadgeColor(result.score)}`}
            >
              {ScoreLabel(result.score)}
            </Badge>
            {result.generatedResume && (
              <Badge className="text-[10px] h-4 px-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/40 gap-0.5">
                <FileCheck2 className="size-2.5" />
                Resume Generated
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(result.createdAt))}
          </p>
        </div>
      </div>

      {/* JD preview */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {truncatedJD}
      </p>

      {/* Score mini breakdown */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {[
          { label: "Keywords", value: result.scoreBreakdown.keywordMatch },
          {
            label: "Experience",
            value: result.scoreBreakdown.experienceRelevance,
          },
          { label: "Skills", value: result.scoreBreakdown.skillsMatch },
          { label: "Format", value: result.scoreBreakdown.formatQuality },
        ].map(({ label, value }) => {
          const barColor =
            value >= 70
              ? "bg-emerald-500"
              : value >= 40
                ? "bg-amber-500"
                : "bg-red-500";
          return (
            <div key={label} className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{label}</span>
                <span className="font-medium tabular-nums">{value}</span>
              </div>
              <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <Button
          size="sm"
          className="flex-1 gap-1.5"
          variant="outline"
          onClick={() => onView(result)}
        >
          <Eye className="size-3.5" />
          View Analysis
        </Button>

        {result.generatedResume && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/30"
            onClick={() => onView(result)}
          >
            <Wand2 className="size-3.5" />
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive hover:text-destructive"
              />
            }
          >
            <Trash2 className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete ATS Analysis?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the ATS analysis
                {result.jobTitle ? (
                  <>
                    {" "}
                    for <span className="font-semibold">{result.jobTitle}</span>
                  </>
                ) : (
                  ""
                )}
                . This action cannot be undone.
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
    </div>
  );
}
