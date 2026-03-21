"use client";

/* ****** Grid list of saved ATS result cards + dialogs ****** */

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATSResultCard } from "./ats-result-card";
import { CreateATSCheckDialog } from "./create-ats-check-dialog";
import { ATSResultDetailDialog } from "./ats-result-detail-dialog";
import { useATSResults } from "../hooks/use-ats-results";
import type { ATSResult } from "@/lib/db/schema";

export function ATSResultList() {
    const { atsResults, isLoading, deleteATSResult } = useATSResults();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState<ATSResult | null>(null);

    async function handleDelete(id: number) {
        try {
            await deleteATSResult(id);
            toast.success("ATS analysis deleted.");
        } catch {
            toast.error("Failed to delete. Please try again.");
        }
    }

    function handleCreated(result: ATSResult) {
        // Auto-open detail dialog after a new analysis is done
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

            {/* Section header + New button */}
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">Your ATS Analyses</h2>
                    <div className="h-px flex-1 bg-border md:hidden" />
                </div>

                <Button
                    size="sm"
                    className="gap-1.5 w-full sm:w-auto"
                    onClick={() => setIsCreateOpen(true)}
                >
                    <Plus className="size-3.5" />
                    New ATS Check
                </Button>
            </div>

            {/* Loading skeletons */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 rounded-xl border bg-muted/30 animate-pulse" />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && (!atsResults || atsResults.length === 0) && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 py-16 gap-3 text-center">
                    <div className="flex items-center justify-center size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Target className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">No ATS analyses yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Run your first ATS check by clicking &ldquo;New ATS Check&rdquo;.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-1.5 mt-2"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="size-3.5" />
                        New ATS Check
                    </Button>
                </div>
            )}

            {/* Results grid */}
            {!isLoading && atsResults && atsResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {atsResults.map((result) => (
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
