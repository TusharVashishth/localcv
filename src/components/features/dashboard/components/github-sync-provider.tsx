"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { signIn, useSession } from "next-auth/react";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import {
  createGitHubSyncExport,
  importGitHubSyncData,
} from "@/lib/db/import-export";
import { db } from "@/lib/db";
import {
  markGitHubSyncClean,
  readGitHubSyncState,
  subscribeToGitHubSyncState,
  updateGitHubRemoteBackupMetadata,
  type GitHubSyncState,
} from "@/lib/github-sync-state";

const AUTO_SYNC_DELAY_MS = 30000;

interface GitHubSyncStatus {
  isConfigured: boolean;
  isAuthenticated: boolean;
  connected: boolean;
  githubLogin?: string;
  repo?: {
    owner: string;
    repo: string;
    url: string;
  };
  remoteBackup?: {
    sha: string;
    exportedAt: string;
  } | null;
}

interface GitHubSyncContextValue {
  hasLocalData: boolean;
  isLoadingStatus: boolean;
  isSyncing: boolean;
  sessionStatus: "authenticated" | "loading" | "unauthenticated";
  syncState: GitHubSyncState;
  syncStatus: GitHubSyncStatus;
  connectGitHubSync: () => Promise<void>;
  backupNow: (options?: { silent?: boolean }) => Promise<void>;
  restoreFromGitHub: (options?: { silent?: boolean }) => Promise<void>;
  syncNow: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

interface GitHubSyncMetadataResponse {
  githubLogin?: string;
  repo?: {
    owner: string;
    repo: string;
    url: string;
  };
  remoteBackup: {
    sha: string;
    exportedAt: string;
  } | null;
}

const defaultSyncStatus: GitHubSyncStatus = {
  isConfigured: false,
  isAuthenticated: false,
  connected: false,
  remoteBackup: null,
};

const GitHubSyncContext = createContext<GitHubSyncContextValue | null>(null);

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
}

export function GitHubSyncProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [syncStatus, setSyncStatus] =
    useState<GitHubSyncStatus>(defaultSyncStatus);
  const [syncState, setSyncState] = useState<GitHubSyncState>(() =>
    readGitHubSyncState(),
  );
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const isPushingRef = useRef(false);

  const localCounts = useLiveQuery(async () => {
    const [profiles, companyResumes, atsResults] = await Promise.all([
      db.profiles.count(),
      db.companyResumes.count(),
      db.atsResults.count(),
    ]);

    return { profiles, companyResumes, atsResults };
  }, []);

  const hasLocalData =
    (localCounts?.profiles ?? 0) +
      (localCounts?.companyResumes ?? 0) +
      (localCounts?.atsResults ?? 0) >
    0;

  const refreshStatus = useCallback(async () => {
    try {
      setIsLoadingStatus(true);
      const response = await fetch("/api/github-sync/status", {
        cache: "no-store",
      });
      const data = await parseResponse<GitHubSyncStatus>(response);
      setSyncStatus({
        ...defaultSyncStatus,
        ...data,
      });
    } catch (error) {
      console.error("Failed to refresh GitHub sync status", error);
      setSyncStatus(defaultSyncStatus);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  const refreshRemoteMetadata = useCallback(
    async (options?: { force?: boolean }) => {
      if (sessionStatus !== "authenticated") {
        setSyncState(readGitHubSyncState());
        return;
      }

      const cachedSyncState = readGitHubSyncState();

      if (
        !options?.force &&
        cachedSyncState.lastRemoteBackupAt &&
        cachedSyncState.lastRemoteBackupSha
      ) {
        setSyncState(cachedSyncState);
        setSyncStatus((currentStatus) => ({
          ...currentStatus,
          githubLogin: session?.user?.githubLogin ?? currentStatus.githubLogin,
          repo:
            cachedSyncState.lastRemoteBackupOwner &&
            cachedSyncState.lastRemoteBackupRepo &&
            cachedSyncState.lastRemoteBackupUrl
              ? {
                  owner: cachedSyncState.lastRemoteBackupOwner,
                  repo: cachedSyncState.lastRemoteBackupRepo,
                  url: cachedSyncState.lastRemoteBackupUrl,
                }
              : currentStatus.repo,
          remoteBackup: {
            sha: cachedSyncState.lastRemoteBackupSha ?? "",
            exportedAt: cachedSyncState.lastRemoteBackupAt ?? "",
          },
        }));
        return;
      }

      try {
        const response = await fetch("/api/github-sync/metadata", {
          cache: "no-store",
        });
        const data = await parseResponse<GitHubSyncMetadataResponse>(response);

        updateGitHubRemoteBackupMetadata({
          lastRemoteBackupAt: data.remoteBackup?.exportedAt ?? null,
          lastRemoteBackupSha: data.remoteBackup?.sha ?? null,
          lastRemoteBackupOwner: data.repo?.owner ?? null,
          lastRemoteBackupRepo: data.repo?.repo ?? null,
          lastRemoteBackupUrl: data.repo?.url ?? null,
        });
        setSyncState(readGitHubSyncState());
        setSyncStatus((currentStatus) => ({
          ...currentStatus,
          githubLogin: data.githubLogin ?? currentStatus.githubLogin,
          repo: data.repo,
          remoteBackup: data.remoteBackup,
        }));
      } catch (error) {
        console.error("Failed to refresh GitHub remote metadata", error);
      }
    },
    [session?.user?.githubLogin, sessionStatus],
  );

  useEffect(() => {
    const unsubscribe = subscribeToGitHubSyncState((nextState) => {
      setSyncState(nextState);
    });

    setSyncState(readGitHubSyncState());

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    void refreshStatus();
  }, [refreshStatus, sessionStatus]);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    setSyncStatus((currentStatus) => ({
      ...currentStatus,
      isAuthenticated: sessionStatus === "authenticated",
      connected: sessionStatus === "authenticated",
      githubLogin: session?.user?.githubLogin ?? currentStatus.githubLogin,
    }));

    if (sessionStatus === "authenticated") {
      void refreshRemoteMetadata();
    }
  }, [refreshRemoteMetadata, session?.user?.githubLogin, sessionStatus]);

  const connectGitHubSync = useCallback(async () => {
    if (!syncStatus.isConfigured) {
      toast.error("GitHub sync is not configured on this deployment yet.");
      return;
    }

    if (sessionStatus !== "authenticated") {
      await signIn("github", {
        callbackUrl: window.location.href,
      });
      return;
    }

    try {
      setIsSyncing(true);
      const response = await fetch("/api/github-sync/connect", {
        method: "POST",
      });

      await parseResponse(response);
      await refreshStatus();
      void refreshRemoteMetadata({ force: true });
      toast.success("GitHub sync is connected.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to connect GitHub sync.";
      toast.error(message);
    } finally {
      setIsSyncing(false);
    }
  }, [
    refreshRemoteMetadata,
    refreshStatus,
    sessionStatus,
    syncStatus.isConfigured,
  ]);

  const backupNow = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!syncStatus.isConfigured) {
        if (!options?.silent) {
          toast.error("GitHub sync is not configured on this deployment yet.");
        }
        return;
      }

      if (sessionStatus !== "authenticated") {
        if (!options?.silent) {
          await signIn("github", { callbackUrl: window.location.href });
        }
        return;
      }

      if (isPushingRef.current) {
        return;
      }

      try {
        isPushingRef.current = true;
        setIsSyncing(true);

        const payload = await createGitHubSyncExport();
        const response = await fetch("/api/github-sync/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload }),
        });

        const data = await parseResponse<{
          sha: string;
          repo?: {
            owner: string;
            repo: string;
            url: string;
          };
          exportedAt: string;
        }>(response);

        markGitHubSyncClean({
          lastRemoteBackupAt: data.exportedAt,
          lastRemoteBackupSha: data.sha,
          lastRemoteBackupOwner: data.repo?.owner,
          lastRemoteBackupRepo: data.repo?.repo,
          lastRemoteBackupUrl: data.repo?.url,
          lastSyncedAt: data.exportedAt,
          lastSyncedSha: data.sha,
        });
        setSyncState(readGitHubSyncState());
        setSyncStatus((currentStatus) => ({
          ...currentStatus,
          remoteBackup: {
            sha: data.sha,
            exportedAt: data.exportedAt,
          },
          repo: data.repo
            ? {
                owner: data.repo.owner,
                repo: data.repo.repo,
                url: data.repo.url,
              }
            : currentStatus.repo,
        }));

        if (!options?.silent) {
          toast.success("GitHub backup updated.");
        }
      } catch (error) {
        if (!options?.silent) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to back up to GitHub.";
          toast.error(message);
        }
      } finally {
        isPushingRef.current = false;
        setIsSyncing(false);
      }
    },
    [sessionStatus, syncStatus.isConfigured],
  );

  const restoreFromGitHub = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!syncStatus.isConfigured) {
        if (!options?.silent) {
          toast.error("GitHub sync is not configured on this deployment yet.");
        }
        return;
      }

      if (sessionStatus !== "authenticated") {
        if (!options?.silent) {
          await signIn("github", { callbackUrl: window.location.href });
        }
        return;
      }

      try {
        setIsSyncing(true);
        const response = await fetch("/api/github-sync/pull", {
          method: "POST",
        });

        const data = await parseResponse<{
          sha: string;
          payload: { exportedAt: string };
        }>(response);

        await importGitHubSyncData(data.payload);

        markGitHubSyncClean({
          lastRemoteBackupAt: data.payload.exportedAt,
          lastRemoteBackupSha: data.sha,
          lastSyncedAt: data.payload.exportedAt,
          lastSyncedSha: data.sha,
        });
        setSyncState(readGitHubSyncState());
        setSyncStatus((currentStatus) => ({
          ...currentStatus,
          remoteBackup: {
            sha: data.sha,
            exportedAt: data.payload.exportedAt,
          },
        }));

        if (!options?.silent) {
          toast.success("GitHub backup restored to this device.");
        }
      } catch (error) {
        if (!options?.silent) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to restore GitHub backup.";
          toast.error(message);
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [sessionStatus, syncStatus.isConfigured],
  );

  const syncNow = useCallback(async () => {
    if (sessionStatus !== "authenticated") {
      await connectGitHubSync();
      return;
    }

    if (!syncStatus.connected) {
      await connectGitHubSync();
      await refreshStatus();
    }

    if (hasLocalData) {
      await backupNow();
      return;
    }

    await restoreFromGitHub();
  }, [
    backupNow,
    connectGitHubSync,
    hasLocalData,
    refreshStatus,
    restoreFromGitHub,
    sessionStatus,
    syncStatus.connected,
  ]);

  useEffect(() => {
    if (
      !syncStatus.connected ||
      !syncStatus.isAuthenticated ||
      !hasLocalData ||
      !syncState.dirty
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void backupNow({ silent: true });
    }, AUTO_SYNC_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    backupNow,
    hasLocalData,
    syncState.dirty,
    syncStatus.connected,
    syncStatus.isAuthenticated,
  ]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (
        document.visibilityState !== "hidden" ||
        !syncStatus.connected ||
        !hasLocalData ||
        !readGitHubSyncState().dirty
      ) {
        return;
      }

      void backupNow({ silent: true });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [backupNow, hasLocalData, syncStatus.connected]);

  return (
    <GitHubSyncContext.Provider
      value={{
        hasLocalData,
        isLoadingStatus,
        isSyncing,
        sessionStatus,
        syncState,
        syncStatus,
        connectGitHubSync,
        backupNow,
        restoreFromGitHub,
        syncNow,
        refreshStatus,
      }}
    >
      {children}
    </GitHubSyncContext.Provider>
  );
}

export function useGitHubSync() {
  const context = useContext(GitHubSyncContext);

  if (!context) {
    throw new Error("useGitHubSync must be used within GitHubSyncProvider.");
  }

  return context;
}
