/* ****** Dexie Database Instance ****** */

import Dexie, { type EntityTable } from "dexie";
import type { AIConfig, Profile } from "./schema";

const db = new Dexie("localcv_db") as Dexie & {
    aiConfigs: EntityTable<AIConfig, "id">;
    profiles: EntityTable<Profile, "id">;
};

db.version(1).stores({
    aiConfigs: "++id",
    profiles: "++id",
});

export { db };
