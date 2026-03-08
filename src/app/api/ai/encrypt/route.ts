import { decryptSecret, encryptSecret } from "@/lib/encryption";
import { z } from "zod";
import { NextResponse } from "next/server";

const encryptSchema = z.object({
    text: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text } = encryptSchema.parse(body);

        const encrypted = await encryptSecret(text);
        return NextResponse.json({ encrypted });
    } catch (error) {
        console.error("Encryption error:", error);
        return NextResponse.json({ error: "Failed to encrypt" }, { status: 500 });
    }
}
