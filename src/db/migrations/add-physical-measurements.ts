import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "local.db");
const db = new Database(dbPath);

console.log("Running migration: add-physical-measurements");

try {
  // Add new columns to patients table for physical measurements
  const migrations = [
    `ALTER TABLE patients ADD COLUMN height TEXT`,
    `ALTER TABLE patients ADD COLUMN weight TEXT`,
    `ALTER TABLE patients ADD COLUMN waist_circumference TEXT`,
    `ALTER TABLE patients ADD COLUMN last_checked_date TEXT`,
  ];

  for (const migration of migrations) {
    try {
      db.exec(migration);
      console.log(`✓ ${migration.split("ADD COLUMN")[1]?.trim()}`);
    } catch (error: any) {
      // Column might already exist, that's okay
      if (!error.message.includes("duplicate column name")) {
        console.error(`✗ ${migration}:`, error.message);
      }
    }
  }

  console.log("\n✅ Migration completed successfully!");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}
