import type { GitHubSyncPayload } from "@/lib/db/import-export";

const GITHUB_API_BASE_URL = "https://api.github.com";
export const GITHUB_SYNC_REPO_NAME = "localcv-backup";
export const GITHUB_SYNC_LATEST_PATH = "backups/latest.json";

interface GitHubUser {
    login: string;
    html_url: string;
}

interface GitHubRepo {
    name: string;
    private: boolean;
    html_url: string;
    owner: {
        login: string;
    };
}

interface GitHubContentFile {
    sha: string;
    content: string;
}

interface GitHubCommitResponse {
    content: {
        sha: string;
        path: string;
    };
    commit: {
        sha: string;
    };
}

export interface BackupRepoInfo {
    owner: string;
    repo: string;
    url: string;
    existed: boolean;
}

export interface RemoteBackupSnapshot {
    sha: string;
    payload: GitHubSyncPayload;
}

export class GitHubSyncError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
        this.name = "GitHubSyncError";
    }
}

async function githubRequest<T>(
    accessToken: string,
    path: string,
    init?: RequestInit,
): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...init?.headers,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const body = await response.text();
        throw new GitHubSyncError(body || "GitHub request failed", response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

export async function getGitHubViewer(accessToken: string): Promise<GitHubUser> {
    return githubRequest<GitHubUser>(accessToken, "/user");
}

export async function getBackupRepo(
    accessToken: string,
    owner: string,
): Promise<GitHubRepo | null> {
    try {
        return await githubRequest<GitHubRepo>(
            accessToken,
            `/repos/${owner}/${GITHUB_SYNC_REPO_NAME}`,
        );
    } catch (error) {
        if (error instanceof GitHubSyncError && error.status === 404) {
            return null;
        }

        throw error;
    }
}

export async function ensureBackupRepo(accessToken: string): Promise<BackupRepoInfo> {
    const viewer = await getGitHubViewer(accessToken);
    const existing = await getBackupRepo(accessToken, viewer.login);

    if (existing) {
        return {
            owner: existing.owner.login,
            repo: existing.name,
            url: existing.html_url,
            existed: true,
        };
    }

    const created = await githubRequest<GitHubRepo>(accessToken, "/user/repos", {
        method: "POST",
        body: JSON.stringify({
            name: GITHUB_SYNC_REPO_NAME,
            private: true,
            auto_init: true,
            description: "Backup repo for localCV resume data sync.",
        }),
    });

    return {
        owner: created.owner.login,
        repo: created.name,
        url: created.html_url,
        existed: false,
    };
}

async function getRepoFile(
    accessToken: string,
    owner: string,
    path: string,
): Promise<GitHubContentFile | null> {
    try {
        return await githubRequest<GitHubContentFile>(
            accessToken,
            `/repos/${owner}/${GITHUB_SYNC_REPO_NAME}/contents/${path}`,
        );
    } catch (error) {
        if (error instanceof GitHubSyncError && error.status === 404) {
            return null;
        }

        throw error;
    }
}

export async function getLatestBackup(
    accessToken: string,
    owner: string,
    parse: (raw: unknown) => GitHubSyncPayload,
): Promise<RemoteBackupSnapshot | null> {
    const file = await getRepoFile(accessToken, owner, GITHUB_SYNC_LATEST_PATH);

    if (!file) {
        return null;
    }

    const decodedContent = Buffer.from(file.content, "base64").toString("utf8");
    const parsedContent: unknown = JSON.parse(decodedContent);

    return {
        sha: file.sha,
        payload: parse(parsedContent),
    };
}

export async function putLatestBackup(
    accessToken: string,
    payload: GitHubSyncPayload,
): Promise<{ sha: string; repo: BackupRepoInfo }> {
    const repo = await ensureBackupRepo(accessToken);
    const existing = await getRepoFile(accessToken, repo.owner, GITHUB_SYNC_LATEST_PATH);
    const content = Buffer.from(JSON.stringify(payload, null, 2), "utf8").toString("base64");
    const commitMessage = existing
        ? `chore: update localcv backup ${payload.exportedAt}`
        : `chore: create localcv backup ${payload.exportedAt}`;

    const response = await githubRequest<GitHubCommitResponse>(
        accessToken,
        `/repos/${repo.owner}/${repo.repo}/contents/${GITHUB_SYNC_LATEST_PATH}`,
        {
            method: "PUT",
            body: JSON.stringify({
                message: commitMessage,
                content,
                sha: existing?.sha,
            }),
        },
    );

    return {
        sha: response.content.sha,
        repo,
    };
}
