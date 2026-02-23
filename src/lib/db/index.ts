/* ****** Dexie Database Instance ****** */

import Dexie, { type EntityTable } from "dexie";
import type { AIConfig, Resume } from "./schema";

const db = new Dexie("LocalCVDatabase") as Dexie & {
    aiConfigs: EntityTable<AIConfig, "id">;
    resumes: EntityTable<Resume, "id">;
};

db.version(1).stores({
    aiConfigs: "++id, provider, modelName, createdAt",
    resumes: "++id, title, templateId, createdAt, updatedAt",
});

export { db };
