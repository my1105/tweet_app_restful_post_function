import os from "os";
import path from "node:path";
import fs from "node:fs/promises";
import {runServer} from "@/server";
import {DatabaseManager, overrideDatabaseManagerForTesting} from "@/db";
import {resetDB} from "@/db/reset_db";

const randomText = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(Array(length))
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

const main = async (): Promise<void> => {
  // Create a brand new database for testing.
  const dbPath = path.join(
    os.tmpdir(),
    `tweet_app-${Date.now()}-${randomText(6)}.db`,
  );
  console.log(`db: ${dbPath}`);
  const dbManager = new DatabaseManager(dbPath);
  overrideDatabaseManagerForTesting(dbManager);
  const db = await dbManager.getInstance();
  const shutDown = async (): Promise<void> => {
    // Make sure the database is deleted after the test.
    await fs.unlink(dbPath);
  };
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);

  // Reset the database to the initial state.
  await resetDB(db);
  // Start the server.
  await runServer();
};

main();
