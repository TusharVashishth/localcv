"use client";

import { useState } from "react";
import { useJobApplication } from "../hooks/use-job-applications";
import dynamic from "next/dynamic";
import { MarkdownRenderer } from "./markdown-renderer";

const ResumePickerDialog = dynamic(
  () => import("./resume-picker-dialog").then((mod) => mod.ResumePickerDialog),
  { ssr: false }
);
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { STATUS_LABELS } from "../types/job-tracker-types";
import {
  CalendarDays,
  Link as LinkIcon,
  DollarSign,
  User,
  Mail,
  Trash2,
  Edit2,
  FileText,
  Unlink,
  BriefcaseBusiness,
  Sparkles,
  CheckCircle2,
  FileTextIcon,
} from "lucide-react";
import Link from "next/link";

interface JobDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: number;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: any) => Promise<void>;
  onLinkResume: (resumeId: number) => Promise<void>;
  onUnlinkResume: () => Promise<void>;
}

export function JobDetailPanel({
  open,
  onOpenChange,
  jobId,
  onEdit,
  onDelete,
  onUpdateStatus,
  onLinkResume,
  onUnlinkResume,
}: JobDetailPanelProps) {
  const { jobApplication, isLoading } = useJobApplication(jobId);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (isLoading || !jobApplication) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <div className="py-20 text-center text-xs text-muted-foreground animate-pulse">
            Loading application details...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(jobApplication.applicationDate));

  const followUpFormatted = jobApplication.followUpDate
    ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(jobApplication.followUpDate))
    : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl sm:max-w-3xl flex flex-col max-h-[90vh] md:max-h-[85vh] p-6 overflow-hidden gap-4">
          <DialogHeader className="space-y-4 pr-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex items-center justify-center size-11 rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white shrink-0 shadow-md shadow-primary/20">
                  <BriefcaseBusiness className="size-5" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-lg font-bold leading-tight truncate">
                    {jobApplication.role}
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    {jobApplication.companyName}
                    {jobApplication.source && (
                      <>
                        <span className="text-muted-foreground/45">•</span>
                        <Badge variant="outline" className="text-[10px] h-4 py-0 px-1.5">
                          {jobApplication.source}
                        </Badge>
                      </>
                    )}
                  </DialogDescription>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-start">
                <Select
                  value={jobApplication.status}
                  onValueChange={(val) => onUpdateStatus(val)}
                >
                  <SelectTrigger className="h-8 text-xs w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([status, label]) => (
                      <SelectItem key={status} value={status} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" className="h-8 w-8" onClick={onEdit}>
                  <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/8 hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 pr-1">
            <div className="space-y-6 py-2">
              {/* Linked Resume & Cover Letter Section */}
              <div className="rounded-xl border bg-muted/20 dark:bg-muted/10 p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Linked Resume & Cover Letter
                </h4>

                {jobApplication.companyResume ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="size-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            ✅ {jobApplication.companyResume.companyName} Resume
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Tailored on {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(jobApplication.companyResume.createdAt)}
                            {jobApplication.companyResume.hasCoverLetter && " · With Cover Letter ✉"}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] gap-1 px-2 text-muted-foreground hover:text-destructive"
                        onClick={onUnlinkResume}
                      >
                        <Unlink className="size-3" />
                        Detach
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/company-resumes/${jobApplication.companyResumeId}`}
                        className="flex-1 flex"
                      >
                        <Button variant="outline" size="sm" className="w-full gap-1.5 h-8 text-xs">
                          <FileTextIcon className="size-3.5" />
                          View Resume
                        </Button>
                      </Link>

                      <Link
                        href={`/dashboard/company-resumes/${jobApplication.companyResumeId}/cover-letter`}
                        className="flex-1 flex"
                      >
                        <Button variant="outline" size="sm" className="w-full gap-1.5 h-8 text-xs">
                          <Mail className="size-3.5" />
                          {jobApplication.companyResume.hasCoverLetter ? "View Cover Letter" : "Generate Cover"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground">No tailored resume linked to this job application yet.</p>
                    <div className="flex items-center gap-2 mt-3.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs gap-1.5"
                        onClick={() => setIsPickerOpen(true)}
                      >
                        <FileText className="size-3.5" />
                        Attach Existing
                      </Button>

                      <Link
                        href={`/dashboard/company-resumes?prefill=${encodeURIComponent(jobApplication.companyName)}&role=${encodeURIComponent(jobApplication.role)}&jd=${encodeURIComponent(jobApplication.jobDescription || "")}`}
                        className="flex-1 flex"
                      >
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5">
                          <Sparkles className="size-3.5 text-violet-500" />
                          Create New →
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid of Dates, Salary, Recruiter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meta details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Timeline & Compensation
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0 text-foreground/75" />
                      <span>Applied: <strong className="text-foreground">{formattedDate}</strong></span>
                    </div>

                    {followUpFormatted && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="size-4 shrink-0 text-amber-500" />
                        <span>Follow-up: <strong className="text-foreground">{followUpFormatted}</strong></span>
                      </div>
                    )}

                    {(jobApplication.salaryMin !== undefined || jobApplication.salaryMax !== undefined) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="size-4 shrink-0 text-foreground/75" />
                        <span>
                          Salary:{" "}
                          <strong className="text-foreground">
                            {jobApplication.currency || "USD"}{" "}
                            {jobApplication.salaryMin?.toLocaleString()}
                            {jobApplication.salaryMin !== undefined && jobApplication.salaryMax !== undefined && " – "}
                            {jobApplication.salaryMax?.toLocaleString()}
                          </strong>
                        </span>
                      </div>
                    )}

                    {jobApplication.jobUrl && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <LinkIcon className="size-4 shrink-0 text-foreground/75" />
                        <a
                          href={jobApplication.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium truncate max-w-[200px]"
                        >
                          View Job Posting
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recruiter Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recruiter / Contact
                  </h4>
                  {jobApplication.recruiterName || jobApplication.recruiterEmail ? (
                    <div className="space-y-2.5 text-xs">
                      {jobApplication.recruiterName && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="size-4 shrink-0 text-foreground/75" />
                          <span>Name: <strong className="text-foreground">{jobApplication.recruiterName}</strong></span>
                        </div>
                      )}
                      {jobApplication.recruiterEmail && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="size-4 shrink-0 text-foreground/75" />
                          <span>
                            Email:{" "}
                            <a
                              href={`mailto:${jobApplication.recruiterEmail}`}
                              className="text-primary hover:underline font-medium"
                            >
                              {jobApplication.recruiterEmail}
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No contact information saved.</p>
                  )}
                </div>
              </div>

              {/* Job Description */}
              {jobApplication.jobDescription && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Job Description
                  </h4>
                  <div className="p-3 rounded-lg border bg-muted/10 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto">
                    {jobApplication.jobDescription}
                  </div>
                </div>
              )}

              {/* Personal Notes */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Personal Notes
                </h4>
                {jobApplication.notes ? (
                  <div className="p-3 rounded-lg border bg-amber-500/5 border-amber-500/10 text-xs text-foreground/90 leading-relaxed">
                    <MarkdownRenderer value={jobApplication.notes} />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No notes added. Click edit to add notes.</p>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ResumePickerDialog
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        defaultSearch={jobApplication.companyName}
        onSelect={onLinkResume}
      />
    </>
  );
}
