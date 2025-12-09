import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "src/db/local.db");
const db = new Database(dbPath);

console.log("Running migration: fix-schema");
console.log("Database path:", dbPath);

try {
  // First, check what columns exist
  const tableInfo = db.prepare("PRAGMA table_info(patients)").all();
  console.log("\nCurrent patients table columns:", tableInfo);
  
  const existingColumns = new Set(
    (tableInfo as any[]).map((col: any) => col.name)
  );
  
  // Define all required columns
  const requiredColumns = [
    { name: "id", sql: "id TEXT PRIMARY KEY" },
    { name: "user_id", sql: "user_id TEXT NOT NULL" },
    { name: "name", sql: "name TEXT NOT NULL" },
    { name: "date_of_birth", sql: "date_of_birth INTEGER NOT NULL" },
    { name: "gender", sql: "gender TEXT" },
    { name: "blood_group", sql: "blood_group TEXT" },
    { name: "phone", sql: "phone TEXT" },
    { name: "email", sql: "email TEXT" },
    { name: "address", sql: "address TEXT" },
    { name: "city", sql: "city TEXT" },
    { name: "state", sql: "state TEXT" },
    { name: "pincode", sql: "pincode TEXT" },
    { name: "emergency_name", sql: "emergency_name TEXT" },
    { name: "emergency_relation", sql: "emergency_relation TEXT" },
    { name: "emergency_phone", sql: "emergency_phone TEXT" },
    { name: "allergies", sql: "allergies TEXT" },
    { name: "chronic_conditions", sql: "chronic_conditions TEXT" },
    { name: "current_medications", sql: "current_medications TEXT" },
    { name: "previous_surgeries", sql: "previous_surgeries TEXT" },
    { name: "height", sql: "height TEXT" },
    { name: "weight", sql: "weight TEXT" },
    { name: "waist_circumference", sql: "waist_circumference TEXT" },
    { name: "last_checked_date", sql: "last_checked_date TEXT" },
    { name: "registered_on_blockchain", sql: "registered_on_blockchain INTEGER DEFAULT 0 NOT NULL" },
    { name: "blockchain_tx_hash", sql: "blockchain_tx_hash TEXT" },
    { name: "last_synced_at", sql: "last_synced_at INTEGER" },
    { name: "created_at", sql: "created_at INTEGER" },
    { name: "updated_at", sql: "updated_at INTEGER" },
  ];
  
  console.log("\nAdding missing columns...");
  
  for (const column of requiredColumns) {
    if (!existingColumns.has(column.name)) {
      try {
        const alterSql = `ALTER TABLE patients ADD COLUMN ${column.sql.split(" ").slice(1).join(" ")}`;
        db.exec(alterSql);
        console.log(`✓ Added column: ${column.name}`);
      } catch (error: any) {
        if (!error.message.includes("duplicate column name")) {
          console.error(`✗ Failed to add ${column.name}:`, error.message);
        }
      }
    } else {
      console.log(`- Column exists: ${column.name}`);
    }
  }
  
  console.log("\n✓ Schema fix migration completed successfully");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}

db.close();
