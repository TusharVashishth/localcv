"use client";

/* ****** Grid list of company resume cards ****** */

import { useState } from "react";
import { Plus, BriefcaseBusiness, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CompanyResumeCard } from "./company-resume-card";
import { CreateCompanyResumeDialog } from "./create-company-resume-dialog";
import { useCompanyResumes } from "../hooks/use-company-resumes";

export function CompanyResumeList() {
  const [companyNameSearch, setCompanyNameSearch] = useState("");
  const { companyResumes, isLoading, deleteCompanyResume } = useCompanyResumes(companyNameSearch);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const hasSearch = companyNameSearch.trim().length > 0;
  const count = companyResumes?.length ?? 0;

  async function handleDelete(id: number) {
    try {
      await deleteCompanyResume(id);
      toast.success("Company resume deleted.");
    } catch {
      toast.error("Failed to delete. Please try again.");
    }
  }

  return (
    <>
      <CreateCompanyResumeDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {/* ****** Toolbar ****** */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Resumes</h2>
          {!isLoading && count > 0 && (
            <Badge variant="secondary" className="h-5 text-[10px] px-1.5">
              {count}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={companyNameSearch}
              onChange={(e) => setCompanyNameSearch(e.target.value)}
              placeholder="Search by company…"
              className="pl-8 pr-8 h-8 text-sm"
            />
            {hasSearch && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setCompanyNameSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-3.5" />
            New Resume
          </Button>
        </div>
      </div>

      {/* ****** Loading skeleton ****** */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 rounded-xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
      )}

      {/* ****** Empty — no resumes ****** */}
      {!isLoading && count === 0 && !hasSearch && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 dark:bg-muted/5 py-20 gap-4 text-center">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/30">
            <BriefcaseBusiness className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">No company resumes yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Create your first AI-tailored resume by clicking below — each one is crafted for a specific company and role.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-3.5" />
            New Company Resume
          </Button>
        </div>
      )}

      {/* ****** Empty — search no results ****** */}
      {!isLoading && count === 0 && hasSearch && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 dark:bg-muted/5 py-16 gap-3 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-muted/50 text-muted-foreground">
            <Search className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">
              No resume matched &quot;{companyNameSearch.trim()}&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCompanyNameSearch("")}
            className="text-xs text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* ****** Grid ****** */}
      {!isLoading && count > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyResumes!.map((resume) => (
            <CompanyResumeCard key={resume.id} resume={resume} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}
