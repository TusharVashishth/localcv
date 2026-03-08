import { Agent } from "@mastra/core/agent";
import { NextResponse } from "next/server";
import { z } from "zod";

const verifyApiKeySchema = z.object({
    provider: z.string().trim().min(1),
    modelName: z.string().trim().min(1),
    apiKey: z.string().trim().min(8),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = verifyApiKeySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid request payload.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const { provider, modelName, apiKey } = parsed.data;
        const verifierAgent = new Agent({
            id: "api-key-verifier",
            name: "API Key Verifier",
            instructions: "You are a helpful assistant.",
            model: {
                id: `${provider}/${modelName}`,
                apiKey,
            },
        });

        await verifierAgent.generate("Hey what's up?",);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to verify API key.",
            },
            { status: 400 },
        );
    }
}
