import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ensureBackupRepo } from "@/lib/github-sync";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const repo = await ensureBackupRepo(session.accessToken);

        return NextResponse.json({
            connected: true,
            repo,
        });
    } catch (error) {
        console.error("GitHub sync connect error:", error);
        return NextResponse.json(
            { error: "Failed to connect GitHub sync." },
            { status: 500 },
        );
    }
}
