"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  Mail,
  AlertCircle,
  Building2,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobApplicationWithResume } from "../types/job-tracker-types";

interface JobCardProps {
  job: JobApplicationWithResume;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent, id: number) => void;
}

export function JobCard({ job, onClick, onDragStart }: JobCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(job.applicationDate));

  // Determine if follow-up is due or past due
  const isFollowUpDue = () => {
    if (!job.followUpDate) return false;
    const followDate = new Date(job.followUpDate).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    return followDate <= today;
  };

  const showAlert = isFollowUpDue() && job.status !== "offer" && job.status !== "rejected" && job.status !== "withdrawn";

  const handleDragStart = (e: React.DragEvent) => {
    if (job.id && onDragStart) {
      onDragStart(e, job.id);
    }
  };

  return (
    <motion.div
      layoutId={`card-${job.id}`}
      whileHover={{ y: -2, transition: { duration: 0.12 } }}
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={handleDragStart as any}
      className="group relative cursor-grab active:cursor-grabbing select-none rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/25 dark:hover:border-primary/20"
    >
      {/* Alert badge */}
      {showAlert && (
        <div className="absolute top-2 right-2 flex items-center justify-center size-5 rounded-full bg-amber-500/10 text-amber-500" title="Follow-up due!">
          <AlertCircle className="size-3.5" />
        </div>
      )}

      {/* Role & Company */}
      <div className="space-y-1.5 pr-4">
        <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
          {job.role}
        </h4>
        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
          <Building2 className="size-3 shrink-0" />
          <span className="truncate max-w-[120px] font-medium">{job.companyName}</span>
        </div>
      </div>

      {/* Badges and source */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        {job.source && (
          <Badge variant="secondary" className="text-[9px] px-1 py-0.2 h-4 shrink-0 bg-muted/70 text-muted-foreground">
            {job.source}
          </Badge>
        )}

        {/* Salary hint */}
        {(job.salaryMin !== undefined || job.salaryMax !== undefined) && (
          <Badge variant="outline" className="text-[9px] px-1 py-0.2 h-4 shrink-0 font-medium">
            {job.currency === "USD" ? "$" : job.currency || ""}{" "}
            {job.salaryMax ? `${job.salaryMax >= 1000 ? `${(job.salaryMax/1000).toFixed(0)}k` : job.salaryMax}` : `${job.salaryMin}`}
          </Badge>
        )}
      </div>

      {/* Footer info (Dates + Attached docs) */}
      <div className="flex items-center justify-between border-t mt-3 pt-2.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3 shrink-0" />
          {formattedDate}
        </span>

        {/* Document status icons */}
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

        {job.followUpDate && !showAlert && (
          <div className="flex items-center gap-0.5 text-amber-500" title={`Follow-up on ${job.followUpDate}`}>
            <Clock className="size-3" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
