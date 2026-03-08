import { decryptSecret } from "@/lib/encryption";
import { z } from "zod";
import { NextResponse } from "next/server";

const decryptSchema = z.object({
    encryptedText: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { encryptedText } = decryptSchema.parse(body);

        const decrypted = await decryptSecret(encryptedText);
        return NextResponse.json({ decrypted });
    } catch (error) {
        console.error("Decryption error:", error);
        return NextResponse.json({ error: "Failed to decrypt" }, { status: 500 });
    }
}
