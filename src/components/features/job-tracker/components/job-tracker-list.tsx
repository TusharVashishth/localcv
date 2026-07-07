"use client";

import { useState } from "react";
import type { JobApplicationWithResume, JobApplicationStatus } from "../types/job-tracker-types";
import { STATUS_LABELS } from "../types/job-tracker-types";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  FileText,
  Mail,
  User,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface JobTrackerListProps {
  jobs: JobApplicationWithResume[];
  onCardClick: (id: number) => void;
}

type SortField = "companyName" | "role" | "applicationDate" | "status";
type SortOrder = "asc" | "desc";

/** ****** Status badge styling config ****** */
const STATUS_CONFIG: Record<
  JobApplicationStatus,
  { badge: string; dot: string; label: string }
> = {
  saved: {
    badge: "bg-slate-400/12 text-slate-600 dark:text-slate-300 border-slate-400/30",
    dot: "bg-slate-400",
    label: "Saved",
  },
  applied: {
    badge: "bg-blue-500/12 text-blue-700 dark:text-blue-400 border-blue-400/30",
    dot: "bg-blue-500",
    label: "Applied",
  },
  screening: {
    badge: "bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-400/30",
    dot: "bg-amber-500",
    label: "Screening",
  },
  interview: {
    badge: "bg-violet-500/12 text-violet-700 dark:text-violet-400 border-violet-400/30",
    dot: "bg-violet-500",
    label: "Interview",
  },
  offer: {
    badge: "bg-emerald-500/14 text-emerald-700 dark:text-emerald-400 border-emerald-400/30",
    dot: "bg-emerald-500",
    label: "Offer",
  },
  rejected: {
    badge: "bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-400/30",
    dot: "bg-rose-500",
    label: "Rejected",
  },
  withdrawn: {
    badge: "bg-zinc-400/12 text-zinc-600 dark:text-zinc-400 border-zinc-400/30",
    dot: "bg-zinc-400",
    label: "Withdrawn",
  },
};

/** ****** Company avatar from initials ****** */
const AVATAR_COLORS: Record<JobApplicationStatus, string> = {
  saved: "from-slate-400 to-slate-600",
  applied: "from-blue-500 to-indigo-600",
  screening: "from-amber-400 to-orange-500",
  interview: "from-violet-500 to-purple-600",
  offer: "from-emerald-400 to-teal-500",
  rejected: "from-rose-500 to-red-600",
  withdrawn: "from-zinc-400 to-zinc-500",
};

function CompanyAvatar({ name, status }: { name: string; status: JobApplicationStatus }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`flex items-center justify-center size-9 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[status]} text-white font-bold text-[10px] shrink-0 shadow-sm select-none`}
    >
      {initials || "?"}
    </div>
  );
}

/** ****** Sort button header ****** */
function SortHeader({
  label,
  field,
  activeField,
  order,
  onClick,
}: {
  label: string;
  field: SortField;
  activeField: SortField;
  order: SortOrder;
  onClick: (f: SortField) => void;
}) {
  const isActive = activeField === field;
  return (
    <button
      onClick={() => onClick(field)}
      className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest transition-colors select-none ${
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
      }`}
    >
      {label}
      <ArrowUpDown
        className={`size-3 transition-opacity ${isActive ? "opacity-100" : "opacity-40"}`}
      />
    </button>
  );
}

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

  /** ****** Sort logic ****** */
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
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Scrollable Container for Responsiveness on Small Devices */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] w-full">
          {/* ****** Sticky Header ****** */}
          <div className="sticky top-0 z-10 grid grid-cols-12 gap-2 px-5 py-3 bg-muted/40 dark:bg-muted/20 border-b border-border/50 backdrop-blur-sm">
            <div className="col-span-4">
              <SortHeader label="Company & Role" field="companyName" activeField={sortField} order={sortOrder} onClick={handleSort} />
            </div>
            <div className="col-span-2">
              <SortHeader label="Status" field="status" activeField={sortField} order={sortOrder} onClick={handleSort} />
            </div>
            <div className="col-span-2">
              <SortHeader label="Applied" field="applicationDate" activeField={sortField} order={sortOrder} onClick={handleSort} />
            </div>
            <div className="col-span-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center">
              Contact
            </div>
            <div className="col-span-2 flex justify-end items-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Docs
            </div>
          </div>

          {/* ****** Body ****** */}
          {sortedJobs.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              No matching applications.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {sortedJobs.map((job) => {
                const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.saved;

                const formattedDate = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(job.applicationDate));

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

                return (
                  <div
                    key={job.id}
                    onClick={() => job.id && onCardClick(job.id)}
                    className="group grid grid-cols-12 gap-2 px-5 py-3.5 items-center hover:bg-muted/25 dark:hover:bg-muted/15 transition-colors cursor-pointer"
                  >
                    {/* ****** Company & Role ****** */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <CompanyAvatar name={job.companyName} status={job.status} />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate leading-snug">
                          {job.role}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5 font-medium">
                          {job.companyName}
                        </div>
                      </div>
                    </div>

                    {/* ****** Status Badge ****** */}
                    <div className="col-span-2">
                      <Badge
                        className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${cfg.badge}`}
                      >
                        <span className={`size-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                        {STATUS_LABELS[job.status]}
                        {job.status === "offer" && <Sparkles className="size-2.5 ml-0.5" />}
                      </Badge>
                    </div>

                    {/* ****** Date Applied ****** */}
                    <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CalendarDays className="size-3.5 shrink-0 text-foreground/40" />
                      {formattedDate}
                    </div>

                    {/* ****** Contact ****** */}
                    <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0 pr-2">
                      {job.recruiterName ? (
                        <>
                          <User className="size-3.5 shrink-0 text-foreground/40" />
                          <span className="truncate">{job.recruiterName}</span>
                        </>
                      ) : job.recruiterEmail ? (
                        <>
                          <Mail className="size-3.5 shrink-0 text-foreground/40" />
                          <span className="truncate">{job.recruiterEmail}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground/40 italic">—</span>
                      )}
                    </div>

                    {/* ****** Docs & Chevron ****** */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      {showAlert && (
                        <div
                          className="flex items-center gap-0.5 bg-amber-500/15 text-amber-500 rounded-full px-1.5 py-0.5 text-[9px] font-semibold border border-amber-500/20"
                          title="Follow-up due!"
                        >
                          <AlertCircle className="size-2.5" />
                          <span className="hidden xs:inline">Due</span>
                        </div>
                      )}
                      {!showAlert && job.followUpDate && (
                        <span title={`Follow-up: ${job.followUpDate}`}>
                          <Clock className="size-3.5 text-amber-500/70" />
                        </span>
                      )}
                      {job.companyResume && (
                        <div className="flex items-center gap-1 text-emerald-500" title="Resume linked">
                          <FileText className="size-3.5" />
                          {job.companyResume.hasCoverLetter && (
                            <span title="Cover letter">
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
                          className="text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                      <ChevronRight className="size-4 text-muted-foreground/30 shrink-0 group-hover:text-muted-foreground/60 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
