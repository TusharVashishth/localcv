"use client";

/* ****** Grid list of saved ATS result cards + dialogs ****** */

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ATSResultCard } from "./ats-result-card";
import { CreateATSCheckDialog } from "./create-ats-check-dialog";
import { ATSResultDetailDialog } from "./ats-result-detail-dialog";
import { useATSResults } from "../hooks/use-ats-results";
import type { ATSResult } from "@/lib/db/schema";

export function ATSResultList() {
  const { atsResults, isLoading, deleteATSResult } = useATSResults();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ATSResult | null>(null);
  const count = atsResults?.length ?? 0;

  async function handleDelete(id: number) {
    try {
      await deleteATSResult(id);
      toast.success("ATS analysis deleted.");
    } catch {
      toast.error("Failed to delete. Please try again.");
    }
  }

  function handleCreated(result: ATSResult) {
    setSelectedResult(result);
  }

  return (
    <>
      <CreateATSCheckDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={handleCreated}
      />
      <ATSResultDetailDialog
        result={selectedResult}
        open={!!selectedResult}
        onOpenChange={(open) => { if (!open) setSelectedResult(null); }}
      />

      {/* ****** Toolbar ****** */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Analyses</h2>
          {!isLoading && count > 0 && (
            <Badge variant="secondary" className="h-5 text-[10px] px-1.5">
              {count}
            </Badge>
          )}
        </div>

        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-3.5" />
          New ATS Check
        </Button>
      </div>

      {/* ****** Loading skeletons ****** */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
      )}

      {/* ****** Empty state ****** */}
      {!isLoading && count === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 dark:bg-muted/5 py-20 gap-4 text-center">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
            <Target className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">No ATS analyses yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Paste a job description to instantly score your resume and see exactly what to improve.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-3.5" />
            New ATS Check
          </Button>
        </div>
      )}

      {/* ****** Results grid ****** */}
      {!isLoading && count > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {atsResults!.map((result) => (
            <ATSResultCard
              key={result.id}
              result={result}
              onView={setSelectedResult}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
