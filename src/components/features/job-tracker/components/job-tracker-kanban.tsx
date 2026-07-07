"use client";

import { useState } from "react";
import { JobCard } from "./job-card";
import { STATUS_LABELS } from "../types/job-tracker-types";
import type { JobApplicationStatus, JobApplicationWithResume } from "../types/job-tracker-types";

interface JobTrackerKanbanProps {
  jobs: JobApplicationWithResume[];
  onCardClick: (id: number) => void;
  onUpdateStatus: (id: number, status: JobApplicationStatus) => Promise<void>;
}

/** ****** Rich column config with gradients and colors ****** */
const COLUMN_CONFIG: Record<
  JobApplicationStatus,
  {
    accent: string;
    headerGradient: string;
    headerBorder: string;
    countBg: string;
    countText: string;
    dropHighlight: string;
    icon: string;
    emoji: string;
  }
> = {
  saved: {
    accent: "bg-slate-400",
    headerGradient: "from-slate-500/10 to-transparent",
    headerBorder: "border-slate-400/30",
    countBg: "bg-slate-400/15 border-slate-400/25",
    countText: "text-slate-500 dark:text-slate-400",
    dropHighlight: "border-slate-400/60 bg-slate-400/5",
    icon: "🔖",
    emoji: "📌",
  },
  applied: {
    accent: "bg-blue-500",
    headerGradient: "from-blue-500/12 to-transparent",
    headerBorder: "border-blue-500/30",
    countBg: "bg-blue-500/15 border-blue-500/25",
    countText: "text-blue-600 dark:text-blue-400",
    dropHighlight: "border-blue-500/60 bg-blue-500/5",
    icon: "📤",
    emoji: "✈️",
  },
  screening: {
    accent: "bg-amber-500",
    headerGradient: "from-amber-500/12 to-transparent",
    headerBorder: "border-amber-500/30",
    countBg: "bg-amber-500/15 border-amber-500/25",
    countText: "text-amber-600 dark:text-amber-400",
    dropHighlight: "border-amber-500/60 bg-amber-500/5",
    icon: "🔍",
    emoji: "📞",
  },
  interview: {
    accent: "bg-violet-500",
    headerGradient: "from-violet-500/12 to-transparent",
    headerBorder: "border-violet-500/30",
    countBg: "bg-violet-500/15 border-violet-500/25",
    countText: "text-violet-600 dark:text-violet-400",
    dropHighlight: "border-violet-500/60 bg-violet-500/5",
    icon: "🎤",
    emoji: "💬",
  },
  offer: {
    accent: "bg-emerald-500",
    headerGradient: "from-emerald-500/14 to-transparent",
    headerBorder: "border-emerald-500/30",
    countBg: "bg-emerald-500/15 border-emerald-500/25",
    countText: "text-emerald-600 dark:text-emerald-400",
    dropHighlight: "border-emerald-500/60 bg-emerald-500/5",
    icon: "🏆",
    emoji: "🎉",
  },
  rejected: {
    accent: "bg-rose-500",
    headerGradient: "from-rose-500/10 to-transparent",
    headerBorder: "border-rose-500/30",
    countBg: "bg-rose-500/15 border-rose-500/25",
    countText: "text-rose-600 dark:text-rose-400",
    dropHighlight: "border-rose-500/60 bg-rose-500/5",
    icon: "❌",
    emoji: "📭",
  },
  withdrawn: {
    accent: "bg-zinc-400",
    headerGradient: "from-zinc-400/10 to-transparent",
    headerBorder: "border-zinc-400/30",
    countBg: "bg-zinc-400/15 border-zinc-400/25",
    countText: "text-zinc-500 dark:text-zinc-400",
    dropHighlight: "border-zinc-400/60 bg-zinc-400/5",
    icon: "↩️",
    emoji: "🚪",
  },
};

export function JobTrackerKanban({ jobs, onCardClick, onUpdateStatus }: JobTrackerKanbanProps) {
  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<JobApplicationStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("text/plain", id.toString());
    setActiveDragId(id);
  };

  const handleDragOver = (e: React.DragEvent, status: JobApplicationStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: JobApplicationStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const idStr = e.dataTransfer.getData("text/plain");
    const id = parseInt(idStr, 10);

    if (!isNaN(id) && activeDragId === id) {
      await onUpdateStatus(id, targetStatus);
    }
    setActiveDragId(null);
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
    setDragOverColumn(null);
  };

  /** ****** Group jobs by status ****** */
  const jobsByStatus = (Object.keys(STATUS_LABELS) as JobApplicationStatus[]).reduce(
    (acc, status) => {
      acc[status] = jobs.filter((j) => j.status === status);
      return acc;
    },
    {} as Record<JobApplicationStatus, JobApplicationWithResume[]>
  );

  return (
    <div className="flex gap-3.5 items-start overflow-x-auto pb-6 pt-1 w-full select-none snap-x scrollbar-thin">
      {(Object.entries(STATUS_LABELS) as [JobApplicationStatus, string][]).map(([status, label]) => {
        const cfg = COLUMN_CONFIG[status];
        const columnJobs = jobsByStatus[status] || [];
        const isDraggedOver = dragOverColumn === status;
        const isEmpty = columnJobs.length === 0;

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            onDragEnd={handleDragEnd}
            className={`flex flex-col rounded-2xl border transition-all duration-200 snap-start w-[280px] shrink-0 min-h-[460px] overflow-hidden ${
              isDraggedOver
                ? `${cfg.dropHighlight} shadow-lg scale-[1.015]`
                : "border-border/60 bg-muted/10 dark:bg-muted/5"
            }`}
          >
            {/* ****** Column Header with gradient ****** */}
            <div className={`relative bg-gradient-to-b ${cfg.headerGradient} p-3.5 pb-3 border-b ${cfg.headerBorder}`}>
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${cfg.accent} rounded-t-2xl`} />

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  {/* ****** Column emoji icon ****** */}
                  <span className="text-sm leading-none select-none" role="img" aria-hidden>
                    {cfg.icon}
                  </span>
                  <span className="font-semibold text-xs text-foreground tracking-tight">
                    {label}
                  </span>
                </div>

                {/* ****** Count badge ****** */}
                <div
                  className={`flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full border text-[10px] font-bold ${cfg.countBg} ${cfg.countText}`}
                >
                  {columnJobs.length}
                </div>
              </div>
            </div>

            {/* ****** Column Cards Container ****** */}
            <div className="flex-1 space-y-2.5 overflow-y-auto p-3 max-h-[520px] scrollbar-thin">
              {columnJobs.length > 0 ? (
                columnJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => job.id && onCardClick(job.id)}
                    onDragStart={handleDragStart}
                  />
                ))
              ) : (
                <div
                  className={`h-28 flex flex-col items-center justify-center border border-dashed rounded-xl text-center px-3 gap-1.5 transition-colors ${
                    isDraggedOver
                      ? `${cfg.headerBorder} bg-transparent`
                      : "border-border/40"
                  }`}
                >
                  <span className="text-xl select-none" role="img" aria-hidden>
                    {cfg.emoji}
                  </span>
                  <p className="text-[10px] text-muted-foreground/60 italic leading-snug">
                    Drag a card here
                  </p>
                </div>
              )}

              {/* ****** Drop indicator at bottom when dragging ****** */}
              {isDraggedOver && !isEmpty && (
                <div className={`h-12 flex items-center justify-center border-2 border-dashed rounded-xl ${cfg.headerBorder} text-[10px] ${cfg.countText} font-medium`}>
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
