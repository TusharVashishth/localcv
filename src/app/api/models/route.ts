/* ****** Proxy route for models.dev API ****** */

import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("https://models.dev/api.json", {
            next: { revalidate: 86400 },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch models" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch models" },
            { status: 500 }
        );
    }
}
