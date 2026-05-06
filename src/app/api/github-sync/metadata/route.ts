import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { parseGitHubSyncImport } from "@/lib/db/import-export";
import { getBackupRepo, getGitHubViewer, getLatestBackup } from "@/lib/github-sync";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const viewer = await getGitHubViewer(session.accessToken);
        const repo = await getBackupRepo(session.accessToken, viewer.login);

        if (!repo) {
            return NextResponse.json({
                githubLogin: viewer.login,
                remoteBackup: null,
            });
        }

        const latestBackup = await getLatestBackup(
            session.accessToken,
            viewer.login,
            parseGitHubSyncImport,
        );

        return NextResponse.json({
            githubLogin: viewer.login,
            repo: {
                owner: repo.owner.login,
                repo: repo.name,
                url: repo.html_url,
            },
            remoteBackup: latestBackup
                ? {
                    sha: latestBackup.sha,
                    exportedAt: latestBackup.payload.exportedAt,
                }
                : null,
        });
    } catch (error) {
        console.error("GitHub sync metadata error:", error);
        return NextResponse.json(
            { error: "Failed to load GitHub sync metadata." },
            { status: 500 },
        );
    }
}