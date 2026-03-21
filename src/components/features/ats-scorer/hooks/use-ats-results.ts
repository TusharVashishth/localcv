"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { ATSResult, CompanyResume } from "@/lib/db/schema";

export function useATSResults() {
    const atsResults = useLiveQuery(() =>
        db.atsResults.orderBy("id").reverse().toArray(),
    );

    const isLoading = atsResults === undefined;

    const deleteATSResult = useCallback(async (id: number) => {
        await db.atsResults.delete(id);
    }, []);

    const attachGeneratedResume = useCallback(
        async (atsResultId: number, generatedResume: CompanyResume) => {
            await db.atsResults.update(atsResultId, { generatedResume });
        },
        [],
    );

    return { atsResults, isLoading, deleteATSResult, attachGeneratedResume };
}

export function useATSResult(id: number) {
    const atsResult = useLiveQuery(() => db.atsResults.get(id), [id]);
    const isLoading = atsResult === undefined;

    const attachGeneratedResume = useCallback(
        async (generatedResume: CompanyResume) => {
            await db.atsResults.update(id, { generatedResume });
        },
        [id],
    );

    return { atsResult, isLoading, attachGeneratedResume };
}

export type { ATSResult };
