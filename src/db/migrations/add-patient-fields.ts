import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "local.db");
const db = new Database(dbPath);

console.log("Running migration: add-patient-fields");

try {
  // Add new columns to patients table
  const migrations = [
    // Personal Information
    `ALTER TABLE patients ADD COLUMN gender TEXT`,
    `ALTER TABLE patients ADD COLUMN blood_group TEXT`,
    
    // Contact Information
    `ALTER TABLE patients ADD COLUMN phone TEXT`,
    `ALTER TABLE patients ADD COLUMN email TEXT`,
    `ALTER TABLE patients ADD COLUMN address TEXT`,
    `ALTER TABLE patients ADD COLUMN city TEXT`,
    `ALTER TABLE patients ADD COLUMN state TEXT`,
    `ALTER TABLE patients ADD COLUMN pincode TEXT`,
    
    // Emergency Contact
    `ALTER TABLE patients ADD COLUMN emergency_name TEXT`,
    `ALTER TABLE patients ADD COLUMN emergency_relation TEXT`,
    `ALTER TABLE patients ADD COLUMN emergency_phone TEXT`,
    
    // Medical Information
    `ALTER TABLE patients ADD COLUMN allergies TEXT`,
    `ALTER TABLE patients ADD COLUMN chronic_conditions TEXT`,
    `ALTER TABLE patients ADD COLUMN current_medications TEXT`,
    `ALTER TABLE patients ADD COLUMN previous_surgeries TEXT`,
    
    // Tracking
    `ALTER TABLE patients ADD COLUMN last_synced_at INTEGER`,
    `ALTER TABLE patients ADD COLUMN updated_at INTEGER`,
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
