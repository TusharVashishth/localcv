"use client";

/* ****** Grid list of company resume cards ****** */

import { useState } from "react";
import { Plus, BriefcaseBusiness, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CompanyResumeCard } from "./company-resume-card";
import { CreateCompanyResumeDialog } from "./create-company-resume-dialog";
import { useCompanyResumes } from "../hooks/use-company-resumes";

export function CompanyResumeList() {
  const [companyNameSearch, setCompanyNameSearch] = useState("");
  const { companyResumes, isLoading, deleteCompanyResume } =
    useCompanyResumes(companyNameSearch);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const hasSearch = companyNameSearch.trim().length > 0;

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
      <CreateCompanyResumeDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Your Company Resumes</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={companyNameSearch}
              onChange={(event) => setCompanyNameSearch(event.target.value)}
              placeholder="Search by company name..."
              className="pl-9 pr-9"
            />
            {hasSearch && (
              <button
                type="button"
                aria-label="Clear company search"
                onClick={() => setCompanyNameSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="size-3.5" />
            New Company Resume
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl border bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading &&
        companyResumes &&
        companyResumes.length === 0 &&
        !hasSearch && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 py-16 gap-3 text-center">
            <div className="flex items-center justify-center size-12 rounded-full bg-green-500/10 text-green-600">
              <BriefcaseBusiness className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium">No company resumes yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first tailored resume by clicking &quot;New Company
                Resume&quot;.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-1.5 mt-2"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="size-3.5" />
              New Company Resume
            </Button>
          </div>
        )}

      {!isLoading &&
        companyResumes &&
        companyResumes.length === 0 &&
        hasSearch && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 py-16 gap-3 text-center">
            <div className="flex items-center justify-center size-12 rounded-full bg-muted text-muted-foreground">
              <Search className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">No matching company resumes</p>
              <p className="text-xs text-muted-foreground mt-1">
                No resume matched &quot;{companyNameSearch.trim()}&quot;.
              </p>
            </div>
          </div>
        )}

      {!isLoading && companyResumes && companyResumes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyResumes.map((resume) => (
            <CompanyResumeCard
              key={resume.id}
              resume={resume}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
