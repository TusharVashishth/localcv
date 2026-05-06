import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import {
    GITHUB_SYNC_REPO_NAME,
    getGitHubViewer,
    getLatestBackupMetadata,
} from "@/lib/github-sync";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const githubLogin = session.user?.githubLogin
            ?? (await getGitHubViewer(session.accessToken)).login;
        const latestBackup = await getLatestBackupMetadata(
            session.accessToken,
            githubLogin,
        );

        if (!latestBackup) {
            return NextResponse.json({
                githubLogin,
                remoteBackup: null,
            });
        }

        return NextResponse.json({
            githubLogin,
            repo: {
                owner: githubLogin,
                repo: GITHUB_SYNC_REPO_NAME,
                url: `https://github.com/${githubLogin}/${GITHUB_SYNC_REPO_NAME}`,
            },
            remoteBackup: latestBackup,
        });
    } catch (error) {
        console.error("GitHub sync metadata error:", error);
        return NextResponse.json(
            { error: "Failed to load GitHub sync metadata." },
            { status: 500 },
        );
    }
}
