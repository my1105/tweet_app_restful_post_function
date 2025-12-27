#!/usr/bin/env ts-node -r tsconfig-paths/register --transpile-only

import path from "node:path";
import {databaseManager} from "@/db";
import fs from "node:fs";
import {resetDB} from "@/db/reset_db";

(async () => {
  const dbDir = path.join(path.resolve(), "db");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, {recursive: true});
  }
  const db = await databaseManager.getInstance();
  await resetDB(db);
})();
