"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobApplications } from "../hooks/use-job-applications";
import { TrackerStatsBar } from "./tracker-stats-bar";
import { JobTrackerKanban } from "./job-tracker-kanban";
import { JobTrackerList } from "./job-tracker-list";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const AddJobDialog = dynamic(
  () => import("./add-job-dialog").then((mod) => mod.AddJobDialog),
  { ssr: false }
);

const JobDetailPanel = dynamic(
  () => import("./job-detail-panel").then((mod) => mod.JobDetailPanel),
  { ssr: false }
);
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import {
  Plus,
  Search,
  X,
  Kanban as KanbanIcon,
  List as ListIcon,
  BriefcaseBusiness,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export function JobTrackerClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | undefined>(undefined);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [prefilledValues, setPrefilledValues] = useState<any>(null);

  const {
    jobApplications,
    isLoading,
    saveJobApplication,
    updateJobApplication,
    updateJobApplicationStatus,
    deleteJobApplication,
  } = useJobApplications(search);

  // Check for prefillResumeId query parameter on mount
  useEffect(() => {
    const resumeIdParam = searchParams.get("prefillResumeId");
    if (resumeIdParam) {
      const resumeId = parseInt(resumeIdParam, 10);
      if (!isNaN(resumeId)) {
        db.companyResumes
          .get(resumeId)
          .then((resume) => {
            if (resume) {
              setPrefilledValues({
                companyName: resume.companyName,
                jobDescription: resume.jobDescription,
                companyResumeId: resume.id,
                status: "applied",
              });
              setIsAddOpen(true);
              toast.info(`Prefilled details from ${resume.companyName} resume.`);
            }
          })
          .catch(() => {
            toast.error("Failed to load resume for tracking.");
          })
          .finally(() => {
            // Clean up search parameters in URL
            startTransition(() => {
              router.replace("/dashboard/tracker");
            });
          });
      }
    }
  }, [searchParams, router]);

  const handleCardClick = (id: number) => {
    setSelectedJobId(id);
    setIsDetailOpen(true);
  };

  const handleAddNew = () => {
    setEditingJob(null);
    setPrefilledValues(null);
    setIsAddOpen(true);
  };

  const handleEdit = () => {
    const jobToEdit = jobApplications.find((j) => j.id === selectedJobId);
    if (jobToEdit) {
      setEditingJob(jobToEdit);
      setIsAddOpen(true);
    }
  };

  const handleDelete = async () => {
    if (selectedJobId) {
      const jobToDelete = jobApplications.find((j) => j.id === selectedJobId);
      if (confirm(`Delete application for ${jobToDelete?.companyName}?`)) {
        try {
          await deleteJobApplication(selectedJobId);
          setIsDetailOpen(false);
          toast.success("Job application deleted.");
        } catch {
          toast.error("Failed to delete application.");
        }
      }
    }
  };

  const handleSaveJob = async (values: any) => {
    if (editingJob) {
      await updateJobApplication(editingJob.id, values);
    } else {
      await saveJobApplication(values);
    }
  };

  const handleUpdateStatus = async (status: any) => {
    if (selectedJobId) {
      await updateJobApplicationStatus(selectedJobId, status);
    }
  };

  const handleKanbanUpdateStatus = async (id: number, status: any) => {
    await updateJobApplicationStatus(id, status);
  };

  const handleLinkResume = async (resumeId: number) => {
    if (selectedJobId) {
      try {
        await updateJobApplication(selectedJobId, { companyResumeId: resumeId });
        toast.success("Resume linked successfully.");
      } catch {
        toast.error("Failed to link resume.");
      }
    }
  };

  const handleUnlinkResume = async () => {
    if (selectedJobId) {
      try {
        await updateJobApplication(selectedJobId, { companyResumeId: undefined });
        toast.success("Resume detached.");
      } catch {
        toast.error("Failed to detach resume.");
      }
    }
  };

  const hasSearch = search.trim().length > 0;
  const totalJobsCount = jobApplications?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
        {/* ****** Header ****** */}
        <>
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-emerald-500/5 to-background border-primary/20 dark:border-primary/15 p-5 md:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-emerald-500/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 left-8 size-32 rounded-full bg-primary/8 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center justify-center size-11 rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white shrink-0 shadow-md shadow-primary/20">
                  <KanbanIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h1 className="text-xl font-bold tracking-tight">Applications Tracker</h1>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1">
                      <TrendingUp className="size-2.5" />
                      Pipeline
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Organise job leads, track status transitions, and link documents privately.
                  </p>
                </div>
              </div>

              <Button size="sm" className="gap-1.5 shrink-0 self-start sm:self-center" onClick={handleAddNew}>
                <Plus className="size-3.5" />
                Add Application
              </Button>
            </div>
          </div>
        </>

        {/* ****** Stats Bar ****** */}
        {!isLoading && totalJobsCount > 0 && (

          <TrackerStatsBar jobs={jobApplications} />

        )}

        {/* ****** Toolbar ****** */}
        {!isLoading && (totalJobsCount > 0 || hasSearch) && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-5">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by company or role..."
                  className="pl-8 pr-8 h-8 text-xs"
                />
                {hasSearch && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-0.5 rounded-xl border border-border/60 bg-muted/30 p-1 self-end sm:self-auto shadow-sm">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                    viewMode === "kanban"
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <KanbanIcon className="size-3" />
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                    viewMode === "list"
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListIcon className="size-3" />
                  List
                </button>
              </div>
            </div>
          </>
        )}

        {/* ****** Content Views ****** */}
        <>
          {isLoading ? (
            <div className="py-24 text-center text-xs text-muted-foreground animate-pulse">
              Loading pipeline...
            </div>
          ) : totalJobsCount === 0 && !hasSearch ? (
            /* ****** Empty State ****** */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/10 dark:bg-muted/5 py-24 gap-4 text-center">
              <div className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-primary/15 to-emerald-500/10 text-primary border border-primary/20">
                <BriefcaseBusiness className="size-6" />
              </div>
              <div className="space-y-1 px-4">
                <p className="text-sm font-semibold">Track your first job application</p>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  Move cards across stages, link tailored resumes, log contacts, and manage your pipeline locally.
                </p>
              </div>
              <Button size="sm" className="gap-1.5 mt-2" onClick={handleAddNew}>
                <Plus className="size-3.5" />
                Add Application
              </Button>
            </div>
          ) : (
            /* ****** View Mode Render ****** */
            <div className="pt-2">
              {viewMode === "kanban" ? (
                <JobTrackerKanban
                  jobs={jobApplications}
                  onCardClick={handleCardClick}
                  onUpdateStatus={handleKanbanUpdateStatus}
                />
              ) : (
                <JobTrackerList jobs={jobApplications} onCardClick={handleCardClick} />
              )}
            </div>
          )}
        </>
      </main>

      {/* ****** Dialogs and Panels ****** */}
      <AddJobDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleSaveJob}
        editingJob={editingJob}
        prefilledValues={prefilledValues}
      />

      <JobDetailPanel
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        jobId={selectedJobId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
        onLinkResume={handleLinkResume}
        onUnlinkResume={handleUnlinkResume}
      />
    </div>
  );
}
