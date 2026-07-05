"use client";

import { useState } from "react";
import type { JobApplicationWithResume } from "../types/job-tracker-types";
import { STATUS_LABELS } from "../types/job-tracker-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  FileText,
  Mail,
  User,
  ArrowUpDown,
  Building2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface JobTrackerListProps {
  jobs: JobApplicationWithResume[];
  onCardClick: (id: number) => void;
}

type SortField = "companyName" | "role" | "applicationDate" | "status";
type SortOrder = "asc" | "desc";

const STATUS_BADGE_VARIANTS: Record<string, string> = {
  saved: "bg-muted text-muted-foreground border-border",
  applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30",
  screening: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30",
  interview: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/30",
  offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  withdrawn: "bg-muted text-muted-foreground border-border",
};

export function JobTrackerList({ jobs, onCardClick }: JobTrackerListProps) {
  const [sortField, setSortField] = useState<SortField>("applicationDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Sort logic
  const sortedJobs = [...jobs].sort((a, b) => {
    let comparison = 0;
    if (sortField === "applicationDate") {
      comparison = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
    } else {
      const valA = (a[sortField] || "").toString().toLowerCase();
      const valB = (b[sortField] || "").toString().toLowerCase();
      comparison = valA.localeCompare(valB);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Table Headers */}
      <div className="grid grid-cols-12 px-4 py-3 bg-muted/30 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
        <div className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => handleSort("companyName")}>
          Company & Role <ArrowUpDown className="size-3" />
        </div>
        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => handleSort("status")}>
          Status <ArrowUpDown className="size-3" />
        </div>
        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => handleSort("applicationDate")}>
          Date Applied <ArrowUpDown className="size-3" />
        </div>
        <div className="col-span-2">Contact</div>
        <div className="col-span-2 text-right">Linked Docs</div>
      </div>

      {/* Table Body */}
      {sortedJobs.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          No matching applications.
        </div>
      ) : (
        <div className="divide-y text-xs">
          {sortedJobs.map((job) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(job.applicationDate));

            return (
              <div
                key={job.id}
                onClick={() => job.id && onCardClick(job.id)}
                className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/30 transition-colors cursor-pointer"
              >
                {/* Role & Company */}
                <div className="col-span-4 min-w-0 pr-4">
                  <div className="font-semibold text-sm leading-snug truncate text-foreground group-hover:text-primary">
                    {job.role}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <Building2 className="size-3 shrink-0" />
                    <span className="truncate">{job.companyName}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Badge className={`text-[10px] font-medium border ${STATUS_BADGE_VARIANTS[job.status] || "bg-muted"}`}>
                    {STATUS_LABELS[job.status]}
                  </Badge>
                </div>

                {/* Date Applied */}
                <div className="col-span-2 text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="size-3.5 shrink-0 text-foreground/45" />
                  {formattedDate}
                </div>

                {/* Contact info */}
                <div className="col-span-2 truncate pr-4 text-muted-foreground">
                  {job.recruiterName ? (
                    <div className="flex items-center gap-1">
                      <User className="size-3.5 shrink-0 text-foreground/45" />
                      <span className="truncate">{job.recruiterName}</span>
                    </div>
                  ) : job.recruiterEmail ? (
                    <div className="flex items-center gap-1">
                      <Mail className="size-3.5 shrink-0 text-foreground/45" />
                      <span className="truncate">{job.recruiterEmail}</span>
                    </div>
                  ) : (
                    <span className="italic text-muted-foreground/50">—</span>
                  )}
                </div>

                {/* Linked Docs & Arrow */}
                <div className="col-span-2 flex items-center justify-end gap-3 text-right">
                  {job.companyResume && (
                    <div className="flex items-center gap-1 text-emerald-500 mr-2">
                      <span title="Tailored resume linked">
                        <FileText className="size-3.5" />
                      </span>
                      {job.companyResume.hasCoverLetter && (
                        <span title="Cover letter generated">
                          <Mail className="size-3.5 text-teal-500" />
                        </span>
                      )}
                    </div>
                  )}
                  {job.jobUrl && (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  <ChevronRight className="size-4 text-muted-foreground/45 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
