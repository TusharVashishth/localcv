import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { parseGitHubSyncImport } from "@/lib/db/import-export";
import { getGitHubViewer, getLatestBackup } from "@/lib/github-sync";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const viewer = await getGitHubViewer(session.accessToken);
        const latestBackup = await getLatestBackup(
            session.accessToken,
            viewer.login,
            parseGitHubSyncImport,
        );

        if (!latestBackup) {
            return NextResponse.json(
                { error: "No GitHub backup found." },
                { status: 404 },
            );
        }

        return NextResponse.json({
            ok: true,
            sha: latestBackup.sha,
            payload: latestBackup.payload,
        });
    } catch (error) {
        console.error("GitHub sync pull error:", error);
        return NextResponse.json(
            { error: "Failed to download GitHub backup." },
            { status: 500 },
        );
    }
}
