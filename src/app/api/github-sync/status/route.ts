import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const isConfigured = Boolean(
            process.env.GITHUB_ID && process.env.GITHUB_SECRET && process.env.NEXTAUTH_SECRET,
        );

        if (!isConfigured) {
            return NextResponse.json({
                isConfigured: false,
                isAuthenticated: false,
                connected: false,
            });
        }

        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({
                isConfigured: true,
                isAuthenticated: false,
                connected: false,
            });
        }

        return NextResponse.json({
            isConfigured: true,
            isAuthenticated: true,
            connected: true,
            githubLogin: session.user?.githubLogin ?? undefined,
        });
    } catch (error) {
        console.error("GitHub sync status error:", error);
        return NextResponse.json(
            { error: "Failed to load GitHub sync status." },
            { status: 500 },
        );
    }
}
