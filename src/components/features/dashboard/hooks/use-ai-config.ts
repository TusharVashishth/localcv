/* ****** Hook to check if API key exists ****** */

"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/encryption";

export function useAIConfig() {
    const config = useLiveQuery(() => db.aiConfigs.toCollection().first());
    const isLoading = config === undefined;
    const hasApiKey = !!config?.encryptedApiKey;

    async function saveConfig(provider: string, modelName: string, apiKey: string) {
        const existing = await db.aiConfigs.toCollection().first();
        const now = new Date();
        const encryptedApiKey = await encryptSecret(apiKey);

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

        return decryptSecret(existing.encryptedApiKey);
    }

    return { config, isLoading, hasApiKey, saveConfig, getDecryptedApiKey };
}
