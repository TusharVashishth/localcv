"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { CompanyResume } from "@/lib/db/schema";

export function useCompanyResumes() {
    const companyResumes = useLiveQuery(
        () => db.companyResumes.orderBy("id").reverse().toArray(),
        [],
    );

    const isLoading = companyResumes === undefined;

    const saveCompanyResume = useCallback(
        async (data: Omit<CompanyResume, "id" | "createdAt" | "updatedAt">): Promise<number> => {
            const now = new Date();
            const id = await db.companyResumes.add({ ...data, createdAt: now, updatedAt: now });
            return id as number;
        },
        [],
    );

    const deleteCompanyResume = useCallback(async (id: number): Promise<void> => {
        await db.companyResumes.delete(id);
    }, []);

    return { companyResumes, isLoading, saveCompanyResume, deleteCompanyResume };
}

export function useCompanyResume(id: number) {
    const companyResume = useLiveQuery(() => db.companyResumes.get(id), [id]);
    const isLoading = companyResume === undefined;

    return { companyResume, isLoading };
}
