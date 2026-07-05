"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { JobApplication, JobApplicationStatus } from "@/lib/db/schema";
import type { JobApplicationWithResume } from "../types/job-tracker-types";

export function useJobApplications(searchQuery = "", statusFilter?: JobApplicationStatus | "all") {
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const jobApplications = useLiveQuery(async () => {
    const [apps, resumes] = await Promise.all([
      db.jobApplications.toArray(),
      db.companyResumes.toArray(),
    ]);

    const resumeMap = new Map(resumes.map((r) => [r.id, r]));

    let filteredApps = apps.map((app): JobApplicationWithResume => {
      const resume = app.companyResumeId ? resumeMap.get(app.companyResumeId) : undefined;
      return {
        ...app,
        companyResume: resume
          ? {
              id: resume.id!,
              companyName: resume.companyName,
              createdAt: resume.createdAt,
              hasCoverLetter: !!resume.coverLetter,
            }
          : undefined,
      };
    });

    if (normalizedSearch) {
      filteredApps = filteredApps.filter(
        (app) =>
          app.companyName.toLowerCase().includes(normalizedSearch) ||
          app.role.toLowerCase().includes(normalizedSearch)
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filteredApps = filteredApps.filter((app) => app.status === statusFilter);
    }

    return filteredApps.sort((a, b) => {
      const dateA = new Date(a.applicationDate).getTime();
      const dateB = new Date(b.applicationDate).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return (b.id || 0) - (a.id || 0);
    });
  }, [normalizedSearch, statusFilter]);

  const isLoading = jobApplications === undefined;

  const saveJobApplication = useCallback(
    async (data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">): Promise<number> => {
      const now = new Date();
      const id = await db.jobApplications.add({
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      return id as number;
    },
    []
  );

  const updateJobApplication = useCallback(
    async (
      id: number,
      data: Partial<Omit<JobApplication, "id" | "createdAt" | "updatedAt">>
    ): Promise<void> => {
      await db.jobApplications.update(id, {
        ...data,
        updatedAt: new Date(),
      });
    },
    []
  );

  const updateJobApplicationStatus = useCallback(
    async (id: number, status: JobApplicationStatus): Promise<void> => {
      await db.jobApplications.update(id, {
        status,
        updatedAt: new Date(),
      });
    },
    []
  );

  const deleteJobApplication = useCallback(async (id: number): Promise<void> => {
    await db.jobApplications.delete(id);
  }, []);

  return {
    jobApplications: jobApplications || [],
    isLoading,
    saveJobApplication,
    updateJobApplication,
    updateJobApplicationStatus,
    deleteJobApplication,
  };
}

export function useJobApplication(id?: number) {
  const jobApplication = useLiveQuery(async () => {
    if (id === undefined) return undefined;
    const app = await db.jobApplications.get(id);
    if (!app) return undefined;

    let companyResume = undefined;
    if (app.companyResumeId) {
      const resume = await db.companyResumes.get(app.companyResumeId);
      if (resume) {
        companyResume = {
          id: resume.id!,
          companyName: resume.companyName,
          createdAt: resume.createdAt,
          hasCoverLetter: !!resume.coverLetter,
        };
      }
    }

    return {
      ...app,
      companyResume,
    } as JobApplicationWithResume;
  }, [id]);

  const isLoading = jobApplication === undefined;

  return { jobApplication, isLoading };
}
