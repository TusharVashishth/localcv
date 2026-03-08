/* ****** Hook to check if API key exists ****** */

"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function useAIConfig() {
    const config = useLiveQuery(() => db.aiConfigs.toCollection().first());
    const isLoading = config === undefined;
    const hasApiKey = !!config?.encryptedApiKey;

    async function saveConfig(provider: string, modelName: string, apiKey: string) {
        const response = await fetch("/api/ai/encrypt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: apiKey }),
        });

        if (!response.ok) {
            throw new Error("Failed to encrypt API key");
        }

        const { encrypted: encryptedApiKey } = await response.json();

        const existing = await db.aiConfigs.toCollection().first();
        const now = new Date();

        if (existing?.id) {
            await db.aiConfigs.update(existing.id, {
                provider,
                modelName,
                encryptedApiKey,
                updatedAt: now,
            });
        } else {
            await db.aiConfigs.add({
                provider,
                modelName,
                encryptedApiKey,
                createdAt: now,
                updatedAt: now,
            });
        }
    }

    async function getDecryptedApiKey(): Promise<string | null> {
        const existing = await db.aiConfigs.toCollection().first();
        if (!existing?.encryptedApiKey) {
            return null;
        }

        const response = await fetch("/api/ai/decrypt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ encryptedText: existing.encryptedApiKey }),
        });

        if (!response.ok) {
            throw new Error("Failed to decrypt API key");
        }

        const { decrypted } = await response.json();
        return decrypted;
    }

    return { config, isLoading, hasApiKey, saveConfig, getDecryptedApiKey };
}
