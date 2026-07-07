"use client";

import { useState } from "react";
import { useCompanyResumes } from "@/components/features/company-resume/hooks/use-company-resumes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BriefcaseBusiness, CalendarDays, CheckCircle2 } from "lucide-react";

interface ResumePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (resumeId: number) => void;
  defaultSearch?: string;
}

export function ResumePickerDialog({
  open,
  onOpenChange,
  onSelect,
  defaultSearch = "",
}: ResumePickerDialogProps) {
  const [search, setSearch] = useState(defaultSearch);
  const { companyResumes, isLoading } = useCompanyResumes(search);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach Tailored Resume</DialogTitle>
          <DialogDescription>
            Select a tailored resume to link to this job application.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by company name..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="max-h-[300px] pr-1">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Loading resumes...
            </div>
          ) : !companyResumes || companyResumes.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No tailored resumes found.
            </div>
          ) : (
            <div className="space-y-2 py-1">
              {companyResumes.map((resume) => {
                const formattedDate = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(resume.createdAt);

                return (
                  <button
                    key={resume.id}
                    onClick={() => {
                      if (resume.id) {
                        onSelect(resume.id);
                        onOpenChange(false);
                      }
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-center size-8 rounded-lg bg-violet-500/10 text-violet-600 shrink-0">
                      <BriefcaseBusiness className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-none truncate">
                        {resume.companyName}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-muted-foreground text-[10px]">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {formattedDate}
                        </span>
                        {resume.coverLetter && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40 text-[9px] px-1 py-0.2 h-3.5">
                            <CheckCircle2 className="size-2" /> Letter
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
