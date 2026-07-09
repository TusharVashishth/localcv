"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  Cloud,
  DownloadCloud,
  Loader2,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import { useGoogleDriveSync } from "../hooks/use-google-drive-sync";

const syncPulseBars = [3, 5, 4, 6, 8, 6, 4, 5, 7, 9, 6, 4, 3, 5, 6, 4];

function formatDate(value?: string | null) {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Never";
  }

  return date.toLocaleString();
}

export function GoogleDriveSyncCard() {
  const {
    handleLogin,
    pushToDrive,
    pullFromDrive,
    isSyncing,
    isAuthenticated,
    lastPushedAt,
    lastPulledAt,
  } = useGoogleDriveSync();

  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const connectionLabel = isAuthenticated ? "Connected" : "Not Connected";

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-linear-to-br from-card via-card to-muted/25 p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] sm:p-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.1),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(165,180,252,0.1),transparent_36%)]" />
        <div className="absolute inset-0 flex items-start justify-end px-4 pt-12 sm:px-5 sm:pt-14">
          <div className="flex h-16 w-[60%] max-w-72 items-end gap-1.5 rounded-[1.4rem] border border-white/45 bg-white/20 p-3 opacity-80 backdrop-blur-[1px] mask-[linear-gradient(135deg,transparent,black_14%,black_88%,transparent)] dark:border-white/8 dark:bg-white/5 sm:w-[45%]">
            {syncPulseBars.map((value, index) => (
              <span
                key={index}
                className="flex-1 rounded-full bg-gradient-to-t from-indigo-500/50 to-violet-400/60 dark:from-indigo-400/40 dark:to-violet-300/50"
                style={{ height: `${value * 10}%` }}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-card via-card/80 to-transparent dark:from-card dark:via-card/80" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-indigo-500/15 bg-indigo-500/10 text-foreground shadow-sm shadow-indigo-500/10 dark:border-indigo-400/15 dark:bg-indigo-400/10 dark:shadow-indigo-400/10">
                <Cloud className="size-5 text-indigo-500" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold tracking-[-0.02em] text-foreground">
                    Google Drive Sync
                  </p>
                  <Badge className="border-0 bg-indigo-500/10 text-indigo-700 dark:bg-indigo-400/12 dark:text-indigo-300 hover:bg-indigo-500/10 dark:hover:bg-indigo-400/12">
                    Hidden App Storage
                  </Badge>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Your resume backup lives in Drive&apos;s private app data
                  folder — invisible in your regular Drive, only readable by
                  localCV.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-border/70 bg-background/80 px-2.5 py-1 text-[0.72rem] font-medium backdrop-blur-sm dark:bg-background/35"
              >
                {connectionLabel}
              </Badge>
              {isAuthenticated ? (
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 gap-1 px-2 text-[0.72rem] text-muted-foreground hover:text-foreground"
                  onClick={() => handleLogin()}
                  disabled={isSyncing}
                >
                  <RefreshCw className="size-3" />
                  Reconnect
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2 sm:min-w-56">
            {isAuthenticated ? (
              <>
                <Button
                  size="sm"
                  className="h-10 gap-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-500/90"
                  onClick={pushToDrive}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="size-3.5" />
                  )}
                  Push to Drive
                </Button>
                <AlertDialog
                  open={isRestoreDialogOpen}
                  onOpenChange={setIsRestoreDialogOpen}
                >
                  <AlertDialogTrigger
                    render={
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 gap-2 rounded-xl border-border/70 bg-background/85 backdrop-blur-sm dark:bg-background/35"
                        disabled={isSyncing}
                      />
                    }
                  >
                    <DownloadCloud className="size-3.5" />
                    Pull from Drive
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Restore Google Drive Backup?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will replace the current local resume data on this
                        device with the latest Google Drive backup.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-500/90"
                        onClick={() => {
                          setIsRestoreDialogOpen(false);
                          void pullFromDrive();
                        }}
                      >
                        Restore
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Button
                size="sm"
                className="h-10 gap-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-500/90"
                onClick={() => handleLogin()}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Cloud className="size-3.5" />
                )}
                Connect Google Drive
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-background/85 p-4 backdrop-blur-sm dark:bg-background/35">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Last Pushed
            </p>
            <p className="mt-3 text-sm font-semibold tracking-[-0.03em] text-foreground lg:text-xl">
              {formatDate(lastPushedAt)}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Most recent backup sent to your Drive app data folder.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/85 p-4 backdrop-blur-sm dark:bg-background/35">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Last Pulled
            </p>
            <p className="mt-3 text-sm font-semibold tracking-[-0.03em] text-foreground lg:text-xl">
              {formatDate(lastPulledAt)}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Most recent restore from your Drive backup to this device.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
