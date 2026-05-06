/* ****** Dexie Database Instance ****** */

import Dexie, { type EntityTable } from "dexie";
import { markGitHubSyncDirty } from "@/lib/github-sync-state";
import type { AIConfig, ATSResult, CompanyResume, Profile } from "./schema";

let syncHooksRegistered = false;

const db = new Dexie("localcv_db") as Dexie & {
    aiConfigs: EntityTable<AIConfig, "id">;
    profiles: EntityTable<Profile, "id">;
    companyResumes: EntityTable<CompanyResume, "id">;
    atsResults: EntityTable<ATSResult, "id">;
};

/* ****** v1: existing tables — never modify this block ****** */
db.version(1).stores({
    aiConfigs: "++id",
    profiles: "++id",
});

/* ****** v2: additive — adds companyResumes table ****** */
db.version(2).stores({
    companyResumes: "++id, companyName",
});

/* ****** v3: additive — adds atsResults table ****** */
db.version(3).stores({
    atsResults: "++id, createdAt",
});

/* ****** v4: additive — coverLetter + coverLetterStyle added to companyResumes (non-indexed fields) ****** */
db.version(4).stores({});

if (typeof window !== "undefined" && !syncHooksRegistered) {
    syncHooksRegistered = true;

    [db.profiles, db.companyResumes, db.atsResults].forEach((table) => {
        table.hook("creating", () => {
            markGitHubSyncDirty();
        });
        table.hook("updating", () => {
            markGitHubSyncDirty();
            return undefined;
        });
        table.hook("deleting", () => {
            markGitHubSyncDirty();
        });
    });
}

export { db };
