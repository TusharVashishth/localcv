/* ****** Local Data Import Dialog ****** */

"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { importLocalData } from "@/lib/db/import-export";

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported?: () => void;
}

export function ImportDataDialog({
  open,
  onOpenChange,
  onImported,
}: ImportDataDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const fileName = useMemo(() => file?.name ?? "", [file]);

  async function handleImport() {
    if (!file) {
      toast.error("Please select a JSON file to import.");
      return;
    }

    try {
      setIsImporting(true);

      const fileText = await file.text();
      const parsedJson: unknown = JSON.parse(fileText);
      await importLocalData(parsedJson);

      toast.success("Local data imported successfully.");
      setFile(null);
      onOpenChange(false);
      onImported?.();
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Invalid JSON file. Please upload a valid export file.");
      } else if (error instanceof z.ZodError) {
        const firstIssue = error.issues[0]?.message ?? "Invalid data format.";
        toast.error(`Import failed: ${firstIssue}`);
      } else {
        toast.error("Import failed. Please try again.");
      }
    } finally {
      setIsImporting(false);
    }
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setFile(null);
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Local Data</DialogTitle>
          <DialogDescription>
            Upload a previously exported JSON file. This will replace your
            existing local profile and AI configuration data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="local-data-import">JSON file</Label>
          <Input
            id="local-data-import"
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              setFile(selected);
            }}
            disabled={isImporting}
          />
          {fileName && (
            <p className="text-xs text-muted-foreground">
              Selected: {fileName}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? "Importing..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
