"use client";

import type { JobApplicationWithResume } from "../types/job-tracker-types";
import {
  FileCheck,
  PhoneCall,
  MessageSquare,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react";

interface TrackerStatsBarProps {
  jobs: JobApplicationWithResume[];
}

/** ****** Full-background gradient config synced with kanban status colors ****** */
const STAT_CONFIG = [
  {
    key: "applied",
    label: "Applied",
    icon: FileCheck,
    /** Light bg gradient (card fill) */
    cardBg: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/50",
    border: "border-blue-200/80 dark:border-blue-800/40",
    accentBar: "bg-gradient-to-r from-blue-500 to-indigo-600",
    /** Dark icon gradient for contrast */
    iconBg: "from-blue-600 to-indigo-700",
    valueColor: "text-blue-900 dark:text-blue-100",
    labelColor: "text-blue-700/80 dark:text-blue-300/70",
  },
  {
    key: "screening",
    label: "Screening",
    icon: PhoneCall,
    cardBg: "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/50",
    border: "border-amber-200/80 dark:border-amber-800/40",
    accentBar: "bg-gradient-to-r from-amber-400 to-orange-500",
    iconBg: "from-amber-500 to-orange-600",
    valueColor: "text-amber-900 dark:text-amber-100",
    labelColor: "text-amber-700/80 dark:text-amber-300/70",
  },
  {
    key: "interview",
    label: "Interview",
    icon: MessageSquare,
    cardBg: "bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950/60 dark:to-purple-950/50",
    border: "border-violet-200/80 dark:border-violet-800/40",
    accentBar: "bg-gradient-to-r from-violet-500 to-purple-600",
    iconBg: "from-violet-600 to-purple-700",
    valueColor: "text-violet-900 dark:text-violet-100",
    labelColor: "text-violet-700/80 dark:text-violet-300/70",
  },
  {
    key: "offer",
    label: "Offers",
    icon: Award,
    cardBg: "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/60 dark:to-teal-950/50",
    border: "border-emerald-200/80 dark:border-emerald-800/40",
    accentBar: "bg-gradient-to-r from-emerald-500 to-teal-500",
    iconBg: "from-emerald-600 to-teal-700",
    valueColor: "text-emerald-900 dark:text-emerald-100",
    labelColor: "text-emerald-700/80 dark:text-emerald-300/70",
  },
] as const;

export function TrackerStatsBar({ jobs }: TrackerStatsBarProps) {
  /** ****** Count by status ****** */
  const countByStatus = (status: string) => jobs.filter((j) => j.status === status).length;

  const totalApplied = jobs.filter((j) => j.status !== "saved").length;

  const progressed = jobs.filter(
    (j) => j.status === "screening" || j.status === "interview" || j.status === "offer"
  ).length;

  const responseRate = totalApplied > 0 ? Math.round((progressed / totalApplied) * 100) : 0;

  const respondedJobs = jobs.filter((j) => j.status !== "saved" && j.status !== "applied");
  let avgDaysToResponse = 0;
  if (respondedJobs.length > 0) {
    const totalDays = respondedJobs.reduce((sum, job) => {
      const diffDays = Math.ceil(
        Math.max(0, new Date(job.updatedAt).getTime() - new Date(job.applicationDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return sum + diffDays;
    }, 0);
    avgDaysToResponse = Math.round(totalDays / respondedJobs.length);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {/* ****** Status stat cards ****** */}
      {STAT_CONFIG.map((cfg) => {
        const Icon = cfg.icon;
        const count = countByStatus(cfg.key);

        return (
          <div
            key={cfg.key}
            className={`relative overflow-hidden rounded-2xl border ${cfg.border} ${cfg.cardBg} p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-default`}
          >
            {/* ****** Top accent bar ****** */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${cfg.accentBar}`} />

            {/* ****** Icon with dark gradient for contrast ****** */}
            <div
              className={`inline-flex items-center justify-center size-8 rounded-xl bg-gradient-to-br ${cfg.iconBg} text-white shadow-sm mb-3`}
            >
              <Icon className="size-3.5" />
            </div>

            {/* ****** Count ****** */}
            <p className={`text-2xl font-black leading-none tracking-tight ${cfg.valueColor}`}>
              {count}
            </p>

            {/* ****** Label ****** */}
            <p className={`text-[10px] font-semibold uppercase tracking-widest mt-1.5 ${cfg.labelColor}`}>
              {cfg.label}
            </p>
          </div>
        );
      })}

      {/* ****** Response Rate ****** */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/40 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-800/50 p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-default">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />

        <div className="inline-flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 text-white shadow-sm mb-3">
          <TrendingUp className="size-3.5" />
        </div>

        <div className="flex items-baseline gap-1 leading-none">
          <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {responseRate}%
          </p>
        </div>
        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600/80 dark:text-slate-300/70">
            Response Rate
          </p>
          <span className="text-[9px] text-slate-500/60 dark:text-slate-400/50 font-normal">
            ({progressed}/{totalApplied})
          </span>
        </div>
      </div>

      {/* ****** Avg. Response Speed ****** */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/60 dark:to-yellow-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-default">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 to-yellow-500" />

        <div className="inline-flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-700 text-white shadow-sm mb-3">
          <Clock className="size-3.5" />
        </div>

        <p className="text-2xl font-black leading-none tracking-tight text-amber-900 dark:text-amber-100">
          {avgDaysToResponse > 0 ? avgDaysToResponse : "—"}
        </p>
        <div className="flex items-baseline gap-1 mt-1.5 flex-wrap">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700/80 dark:text-amber-300/70">
            Response Speed
          </p>
          {avgDaysToResponse > 0 && (
            <span className="text-[9px] text-amber-600/60 dark:text-amber-400/50">days avg</span>
          )}
        </div>
      </div>
    </div>
  );
}
