/* ****** Hook to check if API key exists ****** */

"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function useAIConfig() {
    const config = useLiveQuery(() => db.aiConfigs.toCollection().first());
    const isLoading = config === undefined;
    const hasApiKey = !!config?.apiKey;

    async function saveConfig(provider: string, modelName: string, apiKey: string) {
        const existing = await db.aiConfigs.toCollection().first();
        const now = new Date();

        if (existing?.id) {
            await db.aiConfigs.update(existing.id, {
                provider,
                modelName,
                apiKey,
                updatedAt: now,
            });
        } else {
            await db.aiConfigs.add({
                provider,
                modelName,
                apiKey,
                createdAt: now,
                updatedAt: now,
            });
        }
    }

    return { config, isLoading, hasApiKey, saveConfig };
}
