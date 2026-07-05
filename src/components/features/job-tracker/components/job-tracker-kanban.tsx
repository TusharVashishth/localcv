"use client";

import { useState } from "react";
import { JobCard } from "./job-card";
import { STATUS_LABELS } from "../types/job-tracker-types";
import type { JobApplicationStatus, JobApplicationWithResume } from "../types/job-tracker-types";
import { Badge } from "@/components/ui/badge";

interface JobTrackerKanbanProps {
  jobs: JobApplicationWithResume[];
  onCardClick: (id: number) => void;
  onUpdateStatus: (id: number, status: JobApplicationStatus) => Promise<void>;
}

// Columns config with specific styling tokens for top-bar accents
const COLUMN_ACCENTS: Record<JobApplicationStatus, string> = {
  saved: "bg-muted-foreground/35",
  applied: "bg-blue-500",
  screening: "bg-amber-500",
  interview: "bg-violet-500",
  offer: "bg-emerald-500",
  rejected: "bg-destructive/60",
  withdrawn: "bg-muted-foreground/35",
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

  // Group jobs by status
  const jobsByStatus = (Object.keys(STATUS_LABELS) as JobApplicationStatus[]).reduce(
    (acc, status) => {
      acc[status] = jobs.filter((j) => j.status === status);
      return acc;
    },
    {} as Record<JobApplicationStatus, JobApplicationWithResume[]>
  );

  return (
    <div className="flex gap-4 items-start overflow-x-auto pb-5 pt-1 w-full select-none snap-x">
      {(Object.entries(STATUS_LABELS) as [JobApplicationStatus, string][]).map(([status, label]) => {
        const columnJobs = jobsByStatus[status] || [];
        const isDraggedOver = dragOverColumn === status;

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            onDragEnd={handleDragEnd}
            className={`flex flex-col rounded-xl border bg-muted/20 dark:bg-muted/10 p-3 w-[290px] shrink-0 min-h-[450px] transition-all duration-200 snap-start ${
              isDraggedOver
                ? "border-primary bg-primary/5 dark:bg-primary/5 shadow-inner scale-[1.01]"
                : "border-border"
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                {/* Visual Accent Bar */}
                <div className={`w-1.5 h-3.5 rounded-full ${COLUMN_ACCENTS[status]}`} />
                <span className="font-semibold text-xs text-foreground tracking-tight">
                  {label}
                </span>
              </div>
              <Badge variant="secondary" className="h-4.5 text-[9px] px-1.5 font-medium bg-muted/65">
                {columnJobs.length}
              </Badge>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[500px] pr-0.5">
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
                <div className="h-20 flex items-center justify-center border border-dashed rounded-lg text-[10px] text-muted-foreground italic px-2 text-center select-none">
                  Drag here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
