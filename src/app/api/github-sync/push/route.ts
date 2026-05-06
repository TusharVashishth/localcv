import { getServerSession } from "next-auth";
import { z } from "zod";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { parseGitHubSyncImport } from "@/lib/db/import-export";
import { putLatestBackup } from "@/lib/github-sync";

const pushRequestSchema = z.object({
    payload: z.unknown(),
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { payload } = pushRequestSchema.parse(body);
        const parsedPayload = parseGitHubSyncImport(payload);
        const result = await putLatestBackup(session.accessToken, parsedPayload);

        return NextResponse.json({
            ok: true,
            sha: result.sha,
            repo: result.repo,
            exportedAt: parsedPayload.exportedAt,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0]?.message ?? "Invalid sync payload." },
                { status: 400 },
            );
        }

        console.error("GitHub sync push error:", error);
        return NextResponse.json(
            { error: "Failed to push GitHub backup." },
            { status: 500 },
        );
    }
}
