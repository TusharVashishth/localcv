"use client";

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
import { useGitHubSync } from "./github-sync-provider";
import { CloudDownload, CloudUpload, Github, RefreshCw } from "lucide-react";

const timelineColumns = [
  [0, 0, 1, 0, 0, 1, 0],
  [0, 1, 2, 1, 0, 1, 0],
  [0, 1, 3, 2, 1, 0, 0],
  [0, 2, 4, 3, 1, 0, 0],
  [0, 1, 3, 2, 1, 1, 0],
  [0, 0, 2, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 1, 2, 1, 0, 2, 0],
  [0, 2, 3, 2, 1, 3, 1],
  [0, 1, 4, 3, 2, 2, 1],
  [1, 2, 3, 2, 1, 1, 0],
  [0, 1, 2, 1, 0, 0, 0],
  [0, 0, 2, 0, 1, 2, 1],
  [1, 2, 3, 1, 2, 3, 1],
  [1, 3, 4, 2, 2, 4, 2],
  [0, 2, 3, 2, 1, 3, 1],
  [0, 1, 2, 1, 1, 2, 0],
  [0, 0, 1, 1, 0, 1, 0],
  [0, 1, 2, 1, 0, 0, 0],
  [0, 1, 3, 2, 1, 1, 0],
  [0, 2, 4, 2, 1, 2, 0],
  [0, 1, 3, 2, 1, 1, 0],
  [0, 0, 2, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0],
];

const contributionToneClasses = {
  0: "bg-zinc-400/10 dark:bg-white/[0.06]",
  1: "bg-emerald-500/10 dark:bg-emerald-400/10",
  2: "bg-emerald-500/16 dark:bg-emerald-400/14",
  3: "bg-emerald-500/24 dark:bg-emerald-400/20",
  4: "bg-emerald-500/32 dark:bg-emerald-400/28",
} as const;

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

export function GitHubSyncCard() {
  const {
    backupNow,
    connectGitHubSync,
    hasLocalData,
    isLoadingStatus,
    isSyncing,
    restoreFromGitHub,
    sessionStatus,
    syncNow,
    syncState,
    syncStatus,
  } = useGitHubSync();

  const lastRemoteBackupAt = formatDate(syncState.lastRemoteBackupAt);
  const lastLocalSyncAt = formatDate(syncState.lastSyncedAt);
  const syncConnectionLabel = isLoadingStatus
    ? "Checking"
    : !syncStatus.isConfigured
      ? "Not Configured"
      : sessionStatus !== "authenticated"
        ? "Signed Out"
        : syncStatus.connected
          ? "Connected"
          : "Ready to Connect";
  const remoteBackupLocation = syncStatus.repo
    ? `${syncStatus.repo.owner}/${syncStatus.repo.repo}`
    : syncState.lastRemoteBackupAt
      ? "Cached metadata from this device."
      : "No private backup repo connected yet.";

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-linear-to-br from-card via-card to-muted/25 p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] sm:p-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(74,222,128,0.1),transparent_36%)]" />
        <div className="absolute inset-0 flex items-start justify-end px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="w-[72%] max-w-104 rounded-[1.4rem] border border-white/45 bg-white/20 p-3 opacity-80 backdrop-blur-[1px] dark:border-white/8 dark:bg-white/5 sm:w-[52%]">
            <div
              aria-hidden="true"
              className="grid grid-flow-col grid-rows-7 gap-1 mask-[linear-gradient(135deg,transparent,black_14%,black_88%,transparent)]"
            >
              {timelineColumns.flatMap((column, columnIndex) =>
                column.map((tone, rowIndex) => (
                  <span
                    key={`${columnIndex}-${rowIndex}`}
                    className={`size-3 rounded-sm border border-black/5 ${contributionToneClasses[tone as keyof typeof contributionToneClasses]} dark:border-white/6`}
                  />
                )),
              )}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-card via-card/80 to-transparent dark:from-card dark:via-card/80" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/10 text-foreground shadow-sm shadow-emerald-500/10 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:shadow-emerald-400/10">
                <Github className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold tracking-[-0.02em] text-foreground">
                    GitHub Sync
                  </p>
                  <Badge className="border-0 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/12">
                    Private Backup
                  </Badge>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Your resume changes are mirrored like a GitHub activity
                  stream, so the latest JSON backup is ready to restore on any
                  device.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-border/70 bg-background/80 px-2.5 py-1 text-[0.72rem] font-medium backdrop-blur-sm dark:bg-background/35"
              >
                {syncConnectionLabel}
              </Badge>
              {syncStatus.githubLogin ? (
                <Badge
                  variant="secondary"
                  className="bg-background/85 px-2.5 py-1 text-[0.72rem] shadow-none backdrop-blur-sm dark:bg-background/35"
                >
                  @{syncStatus.githubLogin}
                </Badge>
              ) : null}
              {syncState.dirty ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 px-2.5 py-1 text-[0.72rem] text-emerald-700 shadow-none dark:bg-emerald-400/12 dark:text-emerald-300"
                >
                  Pending Changes
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2 sm:min-w-56">
            <Button
              size="sm"
              className="h-10 gap-2 rounded-xl shadow-sm shadow-emerald-500/15"
              onClick={syncNow}
              disabled={
                isLoadingStatus || isSyncing || !syncStatus.isConfigured
              }
            >
              <RefreshCw className="size-3.5" />
              {isSyncing
                ? "Syncing..."
                : hasLocalData
                  ? "Sync Now"
                  : "Download Latest"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-10 gap-2 rounded-xl border-border/70 bg-background/85 backdrop-blur-sm dark:bg-background/35"
              onClick={connectGitHubSync}
              disabled={
                isLoadingStatus || isSyncing || !syncStatus.isConfigured
              }
            >
              <Github className="size-3.5" />
              {sessionStatus === "authenticated"
                ? syncStatus.connected
                  ? "Reconnect"
                  : "Connect GitHub"
                : "Sign In with GitHub"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/85 p-4 backdrop-blur-sm dark:bg-background/35">
              <p className="md:text-md text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Latest Remote Backup
              </p>
              <p className="mt-3 text-sm lg:text-xl font-semibold tracking-[-0.03em] text-foreground">
                {lastRemoteBackupAt}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {remoteBackupLocation}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/85 p-4 backdrop-blur-sm dark:bg-background/35">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Last Local Sync
              </p>
              <p className="mt-3 text-sm lg:text-xl font-semibold tracking-[-0.03em] text-foreground">
                {lastLocalSyncAt}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {syncState.dirty
                  ? "Local data changed and is waiting for the next sync window."
                  : "Local resume data is in sync with the latest successful backup."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Timeline Actions
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Push the latest resume state now or restore the newest GitHub
                  snapshot.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-10 gap-2 rounded-xl border-border/70 bg-background/85 backdrop-blur-sm dark:bg-background/35"
                onClick={() => void backupNow()}
                disabled={
                  isLoadingStatus ||
                  isSyncing ||
                  !hasLocalData ||
                  !syncStatus.isConfigured
                }
              >
                <CloudUpload className="size-3.5" />
                Backup Now
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 gap-2 rounded-xl border-border/70 bg-background/85 backdrop-blur-sm dark:bg-background/35"
                      disabled={
                        isLoadingStatus || isSyncing || !syncStatus.isConfigured
                      }
                    />
                  }
                >
                  <CloudDownload className="size-3.5" />
                  Restore Latest
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restore GitHub Backup?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {hasLocalData
                        ? "This will replace the current local resume data on this device with the latest GitHub backup."
                        : "This will download the latest GitHub backup to this device."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void restoreFromGitHub()}>
                      Restore
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {!syncStatus.isConfigured ? (
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Set GITHUB_ID, GITHUB_SECRET, and NEXTAUTH_SECRET to enable this
            feature.
          </p>
        ) : null}
      </div>
    </section>
  );
}
