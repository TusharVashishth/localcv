"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  Mail,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobApplicationWithResume, JobApplicationStatus } from "../types/job-tracker-types";

interface JobCardProps {
  job: JobApplicationWithResume;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent, id: number) => void;
}

/** ****** Status-driven gradient/color config ****** */
const STATUS_CARD_CONFIG: Record<
  JobApplicationStatus,
  { gradient: string; avatarBg: string; avatarText: string; accentColor: string; glowColor: string }
> = {
  saved: {
    gradient: "from-slate-500/8 via-slate-400/5 to-transparent",
    avatarBg: "from-slate-400 to-slate-600",
    avatarText: "text-white",
    accentColor: "text-slate-500",
    glowColor: "shadow-slate-500/10",
  },
  applied: {
    gradient: "from-blue-500/12 via-indigo-500/6 to-transparent",
    avatarBg: "from-blue-500 to-indigo-600",
    avatarText: "text-white",
    accentColor: "text-blue-500",
    glowColor: "shadow-blue-500/15",
  },
  screening: {
    gradient: "from-amber-500/12 via-orange-400/6 to-transparent",
    avatarBg: "from-amber-400 to-orange-500",
    avatarText: "text-white",
    accentColor: "text-amber-500",
    glowColor: "shadow-amber-500/15",
  },
  interview: {
    gradient: "from-violet-500/12 via-purple-500/6 to-transparent",
    avatarBg: "from-violet-500 to-purple-600",
    avatarText: "text-white",
    accentColor: "text-violet-500",
    glowColor: "shadow-violet-500/15",
  },
  offer: {
    gradient: "from-emerald-500/14 via-teal-500/7 to-transparent",
    avatarBg: "from-emerald-400 to-teal-500",
    avatarText: "text-white",
    accentColor: "text-emerald-500",
    glowColor: "shadow-emerald-500/20",
  },
  rejected: {
    gradient: "from-rose-500/10 via-red-400/5 to-transparent",
    avatarBg: "from-rose-500 to-red-600",
    avatarText: "text-white",
    accentColor: "text-rose-500",
    glowColor: "shadow-rose-500/10",
  },
  withdrawn: {
    gradient: "from-zinc-400/8 via-zinc-300/4 to-transparent",
    avatarBg: "from-zinc-400 to-zinc-500",
    avatarText: "text-white",
    accentColor: "text-zinc-400",
    glowColor: "shadow-zinc-400/10",
  },
};

/** ****** Generate company initials avatar ****** */
function CompanyAvatar({
  name,
  config,
}: {
  name: string;
  config: (typeof STATUS_CARD_CONFIG)[JobApplicationStatus];
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`flex items-center justify-center size-8 rounded-lg bg-gradient-to-br ${config.avatarBg} ${config.avatarText} font-bold text-[10px] shrink-0 shadow-sm select-none`}
    >
      {initials || "?"}
    </div>
  );
}

export function JobCard({ job, onClick, onDragStart }: JobCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(job.applicationDate));

  const cfg = STATUS_CARD_CONFIG[job.status] ?? STATUS_CARD_CONFIG.saved;

  /** ****** Follow-up check ****** */
  const isFollowUpDue = () => {
    if (!job.followUpDate) return false;
    const followDate = new Date(job.followUpDate).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    return followDate <= today;
  };

  const showAlert =
    isFollowUpDue() &&
    job.status !== "offer" &&
    job.status !== "rejected" &&
    job.status !== "withdrawn";

  const handleDragStart = (e: React.DragEvent) => {
    if (job.id && onDragStart) {
      onDragStart(e, job.id);
    }
  };

  return (
    <motion.div
      layoutId={`card-${job.id}`}
      whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.15, ease: "easeOut" } }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={handleDragStart as any}
      className={`group relative cursor-grab active:cursor-grabbing select-none rounded-2xl border border-border/60 bg-gradient-to-br ${cfg.gradient} backdrop-blur-sm p-4 transition-all duration-200 hover:shadow-lg hover:${cfg.glowColor} hover:border-border dark:bg-card/80`}
    >
      {/* ****** Subtle gradient overlay ****** */}
      <div className="absolute inset-0 rounded-2xl bg-card/70 dark:bg-card/60 -z-10" />

      {/* ****** Follow-up Alert ****** */}
      {showAlert && (
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-amber-500/15 text-amber-500 rounded-full px-1.5 py-0.5 text-[9px] font-semibold border border-amber-500/25"
          title="Follow-up due!"
        >
          <AlertCircle className="size-2.5" />
          Due
        </div>
      )}

      {/* ****** Top: Avatar + Role/Company ****** */}
      <div className="flex items-start gap-3">
        <CompanyAvatar name={job.companyName} config={cfg} />
        <div className="min-w-0 flex-1 pr-6">
          <h4 className="font-semibold text-[11px] text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug tracking-tight">
            {job.role}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium truncate">
            {job.companyName}
          </p>
        </div>
      </div>

      {/* ****** Badges ****** */}
      {(job.source || job.salaryMin !== undefined || job.salaryMax !== undefined) && (
        <div className="flex flex-wrap items-center gap-1 mt-3">
          {job.source && (
            <Badge
              variant="secondary"
              className="text-[9px] px-1.5 py-0 h-4 shrink-0 bg-muted/60 text-muted-foreground font-medium rounded-full"
            >
              {job.source}
            </Badge>
          )}
          {(job.salaryMin !== undefined || job.salaryMax !== undefined) && (
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0 h-4 shrink-0 font-semibold rounded-full border-border/50 ${cfg.accentColor}`}
            >
              {job.currency === "USD" ? "$" : job.currency || ""}{" "}
              {job.salaryMax
                ? `${job.salaryMax >= 1000 ? `${(job.salaryMax / 1000).toFixed(0)}k` : job.salaryMax}`
                : `${job.salaryMin}`}
            </Badge>
          )}
        </div>
      )}

      {/* ****** Footer: Date + Docs ****** */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3 shrink-0" />
          {formattedDate}
        </span>

        <div className="flex items-center gap-1.5">
          {job.followUpDate && !showAlert && (
            <div
              className="flex items-center gap-0.5 text-amber-500"
              title={`Follow-up on ${job.followUpDate}`}
            >
              <Clock className="size-3" />
            </div>
          )}
          {job.companyResume && (
            <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400" title="Resume attached">
              <FileText className="size-3 shrink-0" />
              {job.companyResume.hasCoverLetter && (
                <span title="Cover letter generated">
                  <Mail className="size-3 shrink-0 text-teal-500 dark:text-teal-400" />
                </span>
              )}
            </div>
          )}
          {job.status === "offer" && (
            <Sparkles className="size-3 text-emerald-400" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
