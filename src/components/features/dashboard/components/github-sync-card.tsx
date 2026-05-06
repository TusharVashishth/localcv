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
  const remoteBackupLocation = syncStatus.repo
    ? `${syncStatus.repo.owner}/${syncStatus.repo.repo}`
    : syncState.lastRemoteBackupAt
      ? "Cached metadata from this device."
      : "No private backup repo connected yet.";

  return (
    <section className="rounded-xl border bg-card p-4 sm:p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg border bg-muted/40">
              <Github className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">GitHub Sync</p>
              <p className="text-xs text-muted-foreground">
                Sign in once, keep a private JSON backup updated automatically,
                and restore the latest data on a new device.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {isLoadingStatus
                ? "Checking"
                : !syncStatus.isConfigured
                  ? "Not Configured"
                  : sessionStatus !== "authenticated"
                    ? "Signed Out"
                    : syncStatus.connected
                      ? "Connected"
                      : "Ready to Connect"}
            </Badge>
            {syncStatus.githubLogin ? (
              <Badge variant="secondary">@{syncStatus.githubLogin}</Badge>
            ) : null}
            {syncState.dirty ? (
              <Badge variant="secondary">Pending Changes</Badge>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2 sm:min-w-55">
          <Button
            size="sm"
            className="gap-2"
            onClick={syncNow}
            disabled={isLoadingStatus || isSyncing || !syncStatus.isConfigured}
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
            className="gap-2"
            onClick={connectGitHubSync}
            disabled={isLoadingStatus || isSyncing || !syncStatus.isConfigured}
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

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Latest Remote Backup
          </p>
          <p className="text-sm font-medium">{lastRemoteBackupAt}</p>
          <p className="text-xs text-muted-foreground">
            {remoteBackupLocation}
          </p>
        </div>
        <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Last Local Sync
          </p>
          <p className="text-sm font-medium">{lastLocalSyncAt}</p>
          <p className="text-xs text-muted-foreground">
            {syncState.dirty
              ? "Local data changed and is waiting for the next sync window."
              : "Local resume data is in sync with the latest successful backup."}
          </p>
        </div>
      </div>

      {!syncStatus.isConfigured ? (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Set GITHUB_ID, GITHUB_SECRET, and NEXTAUTH_SECRET to enable this
          feature.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
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
                className="gap-2"
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
    </section>
  );
}
