"use client";

import { useCallback } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { ProfileFormValues } from "../schema/profile-schema";

export function useProfile() {
    const profile = useLiveQuery(() => db.profiles.toCollection().first());
    const isLoading = profile === undefined;
    const isProfileCompleted = !!profile;

    const saveProfile = useCallback(async (values: ProfileFormValues) => {
        const existing = await db.profiles.toCollection().first();
        const now = new Date();

        const payload = {
            ...values,
            updatedAt: now,
        };

        if (existing?.id) {
            await db.profiles.update(existing.id, payload);
            return;
        }

        await db.profiles.add({
            ...payload,
            createdAt: now,
        });
    }, []);

    return { profile, isLoading, isProfileCompleted, saveProfile };
}
