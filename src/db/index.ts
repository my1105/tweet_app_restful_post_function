import sqlite3 from "sqlite3";
import {open, Database} from "sqlite";
import path from "node:path";
import {getMode} from "@/lib/get_mode";

export class DatabaseManager {
  private readonly filePath: string;
  private database?: Database<sqlite3.Database, sqlite3.Statement>;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // Returns a sqlite#Database. See https://www.npmjs.com/package/sqlite for
  // more information.
  async getInstance(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    if (!this.database) {
      this.database = await open({
        filename: this.filePath,
        driver: sqlite3.Database,
      });
    }
    return this.database;
  }

  async close(): Promise<void> {
    if (!this.database) return;
    await this.database.close();
  }
}

export let databaseManager = new DatabaseManager(
  path.join(path.resolve(), "db", `${getMode()}.db`),
);

export const overrideDatabaseManagerForTesting = (
  dbManager: DatabaseManager,
): void => {
  databaseManager = dbManager;
};
