"use client";

/* ****** Card component for a single company resume entry ****** */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Trash2,
  Download,
  FileText,
  Sparkles,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function CompanyResumeCard({ resume, onDelete }: CompanyResumeCardProps) {
  const router = useRouter();

  const jdPreview =
    resume.jobDescription.length > 100
      ? resume.jobDescription.slice(0, 100) + "…"
      : resume.jobDescription;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(resume.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-violet-500/8 via-pink-500/4 to-transparent border-violet-200/60 dark:border-violet-800/30 p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/8 dark:hover:shadow-violet-500/5"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-pink-500/6 blur-2xl" />

      {/* ****** Header ****** */}
      <div className="flex items-start gap-3 relative">
        <motion.div
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shrink-0 shadow-md shadow-violet-500/25"
        >
          <BriefcaseBusiness className="size-4" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 pr-1">
            {resume.companyName}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <CalendarDays className="size-3 shrink-0" />
            <p className="text-[11px]">{formattedDate}</p>
          </div>
        </div>

        {resume.coverLetter && (
          <Badge className="shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40 text-[10px] gap-1 h-5">
            <CheckCircle2 className="size-2.5" />
            Letter
          </Badge>
        )}
      </div>

      {/* ****** JD preview ****** */}
      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 relative">
        {jdPreview}
      </p>

      {/* ****** Actions ****** */}
      <div className="flex flex-col gap-2 mt-auto relative">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5 h-8 text-xs"
            onClick={() => router.push(`/dashboard/company-resumes/${resume.id}`)}
          >
            <Download className="size-3.5" />
            Resume
          </Button>

          <Button
            size="sm"
            variant={resume.coverLetter ? "secondary" : "outline"}
            className="flex-1 gap-1.5 h-8 text-xs"
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
                Generate
              </>
            )}
          </Button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                size="sm"
                variant="ghost"
                className="w-full gap-1.5 h-7 text-[11px] text-muted-foreground hover:text-destructive hover:bg-destructive/8"
              />
            }
          >
            <Trash2 className="size-3" />
            Delete
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
    </motion.div>
  );
}
