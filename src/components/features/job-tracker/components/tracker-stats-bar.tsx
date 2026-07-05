"use client";

import type { JobApplicationWithResume } from "../types/job-tracker-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

export function TrackerStatsBar({ jobs }: TrackerStatsBarProps) {
  // Count by status
  const countByStatus = (status: string) => jobs.filter((j) => j.status === status).length;

  const saved = countByStatus("saved");
  const applied = countByStatus("applied");
  const screening = countByStatus("screening");
  const interview = countByStatus("interview");
  const offer = countByStatus("offer");
  const rejected = countByStatus("rejected");
  const withdrawn = countByStatus("withdrawn");

  // Total applications that have been submitted (non-saved)
  const totalApplied = jobs.filter((j) => j.status !== "saved").length;

  // Progression count: applications that reached screening, interview, or offer
  const progressed = jobs.filter(
    (j) => j.status === "screening" || j.status === "interview" || j.status === "offer"
  ).length;

  // Calculate Response Rate: percentage of applied jobs that got a response
  const responseRate = totalApplied > 0 ? Math.round((progressed / totalApplied) * 100) : 0;

  // Calculate Average Response Time: time from application date to status update (for responded jobs)
  const respondedJobs = jobs.filter(
    (j) => j.status !== "saved" && j.status !== "applied"
  );
  
  let avgDaysToResponse = 0;
  if (respondedJobs.length > 0) {
    const totalDays = respondedJobs.reduce((sum, job) => {
      const appTime = new Date(job.applicationDate).getTime();
      const updatedTime = new Date(job.updatedAt).getTime();
      const diffTime = Math.max(0, updatedTime - appTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    avgDaysToResponse = Math.round(totalDays / respondedJobs.length);
  }

  const statItems = [
    {
      label: "Applied",
      value: applied,
      icon: FileCheck,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Screening",
      value: screening,
      icon: PhoneCall,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Interview",
      value: interview,
      icon: MessageSquare,
      iconColor: "text-violet-500",
      bgColor: "bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Offers",
      value: offer,
      icon: Award,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
      {/* Dynamic Counts */}
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className={`flex items-center gap-3 p-3 border hover:shadow-xs transition-shadow ${item.bgColor}`}
          >
            <div className={`p-1.5 rounded-lg bg-card text-card-foreground border shrink-0 ${item.iconColor}`}>
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-lg font-bold leading-none mt-1">
                {item.value}
              </p>
            </div>
          </Card>
        );
      })}

      {/* Response Rate */}
      <Card className="flex items-center gap-3 p-3 border bg-muted/20 dark:bg-muted/10 hover:shadow-xs transition-shadow">
        <div className="p-1.5 rounded-lg bg-card text-card-foreground border shrink-0 text-foreground">
          <TrendingUp className="size-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Response Rate
          </p>
          <div className="flex items-baseline gap-1 mt-1 leading-none">
            <span className="text-lg font-bold">{responseRate}%</span>
            <span className="text-[9px] text-muted-foreground font-normal">
              ({progressed}/{totalApplied})
            </span>
          </div>
        </div>
      </Card>

      {/* Avg. Response Time */}
      <Card className="flex items-center gap-3 p-3 border bg-muted/20 dark:bg-muted/10 hover:shadow-xs transition-shadow">
        <div className="p-1.5 rounded-lg bg-card text-card-foreground border shrink-0 text-foreground">
          <Clock className="size-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Response Speed
          </p>
          <p className="text-lg font-bold leading-none mt-1">
            {avgDaysToResponse > 0 ? `${avgDaysToResponse} days` : "—"}
          </p>
        </div>
      </Card>
    </div>
  );
}
