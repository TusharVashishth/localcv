export interface GitHubSyncState {
    dirty: boolean;
    lastRemoteBackupAt: string | null;
    lastRemoteBackupSha: string | null;
    lastRemoteBackupOwner: string | null;
    lastRemoteBackupRepo: string | null;
    lastRemoteBackupUrl: string | null;
    lastSyncedAt: string | null;
    lastSyncedSha: string | null;
}

const GITHUB_SYNC_STORAGE_KEY = "localcv:github-sync-state";
const GITHUB_SYNC_EVENT_NAME = "localcv:github-sync-state-changed";

const defaultGitHubSyncState: GitHubSyncState = {
    dirty: false,
    lastRemoteBackupAt: null,
    lastRemoteBackupSha: null,
    lastRemoteBackupOwner: null,
    lastRemoteBackupRepo: null,
    lastRemoteBackupUrl: null,
    lastSyncedAt: null,
    lastSyncedSha: null,
};

function emitGitHubSyncStateChanged(nextState: GitHubSyncState) {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(
        new CustomEvent<GitHubSyncState>(GITHUB_SYNC_EVENT_NAME, {
            detail: nextState,
        }),
    );
}

function writeGitHubSyncState(nextState: GitHubSyncState) {
    if (typeof window === "undefined") {
        return nextState;
    }

    window.localStorage.setItem(GITHUB_SYNC_STORAGE_KEY, JSON.stringify(nextState));
    emitGitHubSyncStateChanged(nextState);
    return nextState;
}

export function readGitHubSyncState(): GitHubSyncState {
    if (typeof window === "undefined") {
        return defaultGitHubSyncState;
    }

    const rawValue = window.localStorage.getItem(GITHUB_SYNC_STORAGE_KEY);

    if (!rawValue) {
        return defaultGitHubSyncState;
    }

    try {
        const parsedValue = JSON.parse(rawValue) as Partial<GitHubSyncState>;

        return {
            dirty: parsedValue.dirty === true,
            lastRemoteBackupAt: typeof parsedValue.lastRemoteBackupAt === "string"
                ? parsedValue.lastRemoteBackupAt
                : null,
            lastRemoteBackupSha: typeof parsedValue.lastRemoteBackupSha === "string"
                ? parsedValue.lastRemoteBackupSha
                : null,
            lastRemoteBackupOwner: typeof parsedValue.lastRemoteBackupOwner === "string"
                ? parsedValue.lastRemoteBackupOwner
                : null,
            lastRemoteBackupRepo: typeof parsedValue.lastRemoteBackupRepo === "string"
                ? parsedValue.lastRemoteBackupRepo
                : null,
            lastRemoteBackupUrl: typeof parsedValue.lastRemoteBackupUrl === "string"
                ? parsedValue.lastRemoteBackupUrl
                : null,
            lastSyncedAt: typeof parsedValue.lastSyncedAt === "string"
                ? parsedValue.lastSyncedAt
                : null,
            lastSyncedSha: typeof parsedValue.lastSyncedSha === "string"
                ? parsedValue.lastSyncedSha
                : null,
        };
    } catch {
        return defaultGitHubSyncState;
    }
}

export function markGitHubSyncDirty() {
    const currentState = readGitHubSyncState();

    if (currentState.dirty) {
        return currentState;
    }

    return writeGitHubSyncState({
        ...currentState,
        dirty: true,
    });
}

export function markGitHubSyncClean(params: {
    lastRemoteBackupAt?: string;
    lastRemoteBackupSha?: string;
    lastRemoteBackupOwner?: string;
    lastRemoteBackupRepo?: string;
    lastRemoteBackupUrl?: string;
    lastSyncedAt: string;
    lastSyncedSha: string;
}) {
    const currentState = readGitHubSyncState();

    return writeGitHubSyncState({
        dirty: false,
        lastRemoteBackupAt: params.lastRemoteBackupAt ?? currentState.lastRemoteBackupAt,
        lastRemoteBackupSha: params.lastRemoteBackupSha ?? currentState.lastRemoteBackupSha,
        lastRemoteBackupOwner: params.lastRemoteBackupOwner ?? currentState.lastRemoteBackupOwner,
        lastRemoteBackupRepo: params.lastRemoteBackupRepo ?? currentState.lastRemoteBackupRepo,
        lastRemoteBackupUrl: params.lastRemoteBackupUrl ?? currentState.lastRemoteBackupUrl,
        lastSyncedAt: params.lastSyncedAt,
        lastSyncedSha: params.lastSyncedSha,
    });
}

export function updateGitHubRemoteBackupMetadata(params: {
    lastRemoteBackupAt: string | null;
    lastRemoteBackupSha: string | null;
    lastRemoteBackupOwner?: string | null;
    lastRemoteBackupRepo?: string | null;
    lastRemoteBackupUrl?: string | null;
}) {
    const currentState = readGitHubSyncState();

    return writeGitHubSyncState({
        ...currentState,
        lastRemoteBackupAt: params.lastRemoteBackupAt,
        lastRemoteBackupSha: params.lastRemoteBackupSha,
        lastRemoteBackupOwner: params.lastRemoteBackupOwner === undefined
            ? currentState.lastRemoteBackupOwner
            : params.lastRemoteBackupOwner,
        lastRemoteBackupRepo: params.lastRemoteBackupRepo === undefined
            ? currentState.lastRemoteBackupRepo
            : params.lastRemoteBackupRepo,
        lastRemoteBackupUrl: params.lastRemoteBackupUrl === undefined
            ? currentState.lastRemoteBackupUrl
            : params.lastRemoteBackupUrl,
    });
}

export function subscribeToGitHubSyncState(
    listener: (nextState: GitHubSyncState) => void,
) {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    const handler = (event: Event) => {
        const nextState = (event as CustomEvent<GitHubSyncState>).detail;
        listener(nextState ?? readGitHubSyncState());
    };

    window.addEventListener(GITHUB_SYNC_EVENT_NAME, handler);

    return () => {
        window.removeEventListener(GITHUB_SYNC_EVENT_NAME, handler);
    };
}
