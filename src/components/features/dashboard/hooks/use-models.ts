/* ****** Hook to fetch models from models.dev ****** */

"use client";

import { useState, useEffect } from "react";

interface ModelMap {
    [modelId: string]: unknown;
}

interface ModelProvider {
    id: string;
    name: string;
    models: ModelMap;
}

interface ModelsResponse {
    [providerId: string]: {
        id?: string;
        name?: string;
        models?: ModelMap;
        [k: string]: unknown;
    };
}

export function useModels() {
    const [providers, setProviders] = useState<ModelProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchModels() {
            try {
                const response = await fetch("/api/models");
                if (!response.ok) throw new Error("Failed to fetch models");

                const data: ModelsResponse = await response.json();
                console.log("Fetched models data:", JSON.stringify(data, null, 2));
                const parsed: ModelProvider[] = Object.entries(data).map(
                    ([providerId, providerObj]) => ({
                        id: providerObj?.id ?? providerId,
                        name: providerObj?.name ?? providerId,
                        models: providerObj?.models ?? {},
                    })
                );

                setProviders(parsed);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        }

        fetchModels();
    }, []);

    return { providers, isLoading, error };
}
