/* ****** Dexie Database Instance ****** */

import Dexie, { type EntityTable } from "dexie";
import type { AIConfig, Profile, Resume } from "./schema";

const db = new Dexie("localcv_db") as Dexie & {
    aiConfigs: EntityTable<AIConfig, "id">;
    profiles: EntityTable<Profile, "id">;
};

db.version(1).stores({
    aiConfigs: "++id",
    resumes:
        "++id, title, templateId, createdAt, updatedAt, [templateId+updatedAt]",
});

db.version(2).stores({
    aiConfigs: "++id",
    resumes:
        "++id, title, templateId, createdAt, updatedAt, [templateId+updatedAt]",
    profiles: "++id, isCompleted, updatedAt",
});

db.version(3)
    .stores({
        aiConfigs: "++id, provider, modelName, updatedAt",
        profiles: "++id, updatedAt",
        resumes: null,
    })
    .upgrade(async (tx) => {
        const profilesTable = tx.table("profiles");
        const existingProfiles = (await profilesTable.toArray()) as Array<Record<string, unknown>>;
        const resumesTable = tx.table("resumes");
        const legacyResumes = (await resumesTable.toArray()) as Resume[];

        const now = new Date();
        const latestResume = legacyResumes.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0];

        if (latestResume) {
            const mappedProfile = {
                profile: latestResume.profile,
                summary: latestResume.summary,
                experience: latestResume.experience,
                education: latestResume.education,
                skills: latestResume.skills,
                projects: latestResume.projects,
                certifications: latestResume.certifications,
                languages: latestResume.languages,
                createdAt: new Date(latestResume.createdAt),
                updatedAt: new Date(latestResume.updatedAt),
            } satisfies Omit<Profile, "id">;

            await profilesTable.clear();
            await profilesTable.add(mappedProfile);
            return;
        }

        if (existingProfiles.length > 0) {
            const legacyProfile = existingProfiles[0];

            await profilesTable.clear();
            await profilesTable.add({
                profile: {
                    fullName: String(legacyProfile.fullName ?? ""),
                    email: String(legacyProfile.email ?? ""),
                    phone: String(legacyProfile.phone ?? ""),
                    location: String(legacyProfile.location ?? ""),
                    website: typeof legacyProfile.website === "string" ? legacyProfile.website : undefined,
                    linkedin: typeof legacyProfile.linkedin === "string" ? legacyProfile.linkedin : undefined,
                    github: typeof legacyProfile.github === "string" ? legacyProfile.github : undefined,
                },
                summary: String(legacyProfile.summary ?? ""),
                experience: [],
                education: [],
                skills: [],
                projects: [],
                certifications: [],
                languages: [],
                createdAt: now,
                updatedAt: now,
            } satisfies Omit<Profile, "id">);
        }
    });

export { db };
