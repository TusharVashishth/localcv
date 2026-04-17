"use client";

/* ****** Card component for a single company resume entry ****** */

import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Trash2, Download, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { CompanyResume } from "@/lib/db/schema";

interface CompanyResumeCardProps {
  resume: CompanyResume;
  onDelete: (id: number) => Promise<void>;
}

export function CompanyResumeCard({
  resume,
  onDelete,
}: CompanyResumeCardProps) {
  const router = useRouter();
  const truncatedJD =
    resume.jobDescription.length > 120
      ? resume.jobDescription.slice(0, 120) + "…"
      : resume.jobDescription;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-pink-500/10 via-rose-500/5 to-transparent border-pink-200/50 dark:border-pink-800/30 p-5 flex flex-col gap-4 transition-shadow hover:shadow-md">
      {/* ****** Icon + company name ****** */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-linear-to-br from-violet-500 to-pink-500 text-white shrink-0">
          <BriefcaseBusiness className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm truncate">
            {resume.companyName}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(resume.createdAt)}
          </p>
        </div>
      </div>

      {/* ****** JD preview ****** */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {truncatedJD}
      </p>

      {/* ****** Actions ****** */}
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => router.push(`/dashboard/company-resumes/${resume.id}`)}
          >
            <Download className="size-3.5" />
            Resume
          </Button>

          <Button
            size="sm"
            variant={resume.coverLetter ? "secondary" : "outline"}
            className="flex-1 gap-1.5"
            onClick={() => router.push(`/dashboard/company-resumes/${resume.id}/cover-letter`)}
          >
            {resume.coverLetter ? (
              <>
                <FileText className="size-3.5" />
                Cover Letter
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                Cover Letter
              </>
            )}
          </Button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1.5 text-destructive hover:text-destructive"
              />
            }
          >
            <Trash2 className="size-3.5" />
            Delete Resume
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Company Resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the tailored resume for{" "}
                <span className="font-semibold">{resume.companyName}</span>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => resume.id && onDelete(resume.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
