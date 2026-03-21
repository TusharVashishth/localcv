"use client";

/* ****** Dialog showing the full ATS analysis result ****** */

import { useState } from "react";
import { Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ATSScoreResults } from "./ats-score-results";
import { ATSResumeGenerator } from "./ats-resume-generator";
import { db } from "@/lib/db";
import type { ATSResult } from "@/lib/db/schema";

interface ATSResultDetailDialogProps {
  result: ATSResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ATSResultDetailDialog({
  result,
  open,
  onOpenChange,
}: ATSResultDetailDialogProps) {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [localResult, setLocalResult] = useState<ATSResult | null>(null);

  // Use localResult (post-generation update) if available, otherwise prop result
  const activeResult = localResult ?? result;

  // Sync localResult when result prop changes (new dialog open)
  function handleOpenChange(next: boolean) {
    if (!next) setLocalResult(null);
    onOpenChange(next);
  }

  async function handleGenerated(companyResumeId: number) {
    const target = localResult ?? result;
    if (!target?.id) return;
    const companyResume = await db.companyResumes.get(companyResumeId);
    if (companyResume) {
      await db.atsResults.update(target.id, { generatedResume: companyResume });
      setLocalResult({ ...target, generatedResume: companyResume });
    }
  }

  if (!activeResult) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Target className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="truncate">
                  {activeResult.jobTitle
                    ? `ATS Analysis — ${activeResult.jobTitle}`
                    : "ATS Analysis"}
                </DialogTitle>
                <DialogDescription>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(activeResult.createdAt))}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="px-6 py-5">
              <ATSScoreResults
                result={activeResult}
                onReset={() => handleOpenChange(false)}
                onGenerateResume={() => setIsGeneratorOpen(true)}
                isGenerating={isGeneratorOpen}
                hideResetButton
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ATSResumeGenerator
        open={isGeneratorOpen}
        onOpenChange={setIsGeneratorOpen}
        atsResult={activeResult}
        onGenerated={handleGenerated}
      />
    </>
  );
}
