/* ****** Dexie Database Instance ****** */

import Dexie, { type EntityTable } from "dexie";
import type { AIConfig, CompanyResume, Profile } from "./schema";

const db = new Dexie("localcv_db") as Dexie & {
    aiConfigs: EntityTable<AIConfig, "id">;
    profiles: EntityTable<Profile, "id">;
    companyResumes: EntityTable<CompanyResume, "id">;
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

export { db };
