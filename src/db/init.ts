import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "src/db/local.db");
const db = new Database(dbPath);

console.log("Initializing database schema...");
console.log("Database path:", dbPath);

try {
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON");

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      wallet_address TEXT UNIQUE,
      role TEXT NOT NULL,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);
  console.log("✓ Users table created");

  // Create patients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      date_of_birth INTEGER NOT NULL,
      gender TEXT,
      blood_group TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      emergency_name TEXT,
      emergency_relation TEXT,
      emergency_phone TEXT,
      allergies TEXT,
      chronic_conditions TEXT,
      current_medications TEXT,
      previous_surgeries TEXT,
      height TEXT,
      weight TEXT,
      waist_circumference TEXT,
      last_checked_date TEXT,
      registered_on_blockchain INTEGER DEFAULT 0 NOT NULL,
      blockchain_tx_hash TEXT,
      last_synced_at INTEGER,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log("✓ Patients table created");

  // Create doctors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      license_number TEXT UNIQUE,
      hospital_affiliation TEXT,
      phone TEXT,
      verified INTEGER DEFAULT 0 NOT NULL,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log("✓ Doctors table created");

  // Create access_logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS access_logs (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      access_type TEXT NOT NULL,
      accessed_at INTEGER NOT NULL,
      notes TEXT,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    )
  `);
  console.log("✓ Access logs table created");

  console.log("\n✅ Database schema initialized successfully!");
  
  // Show table info
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  console.log("\nAvailable tables:", tables.map((t: any) => t.name).join(", "));

} catch (error) {
  console.error("❌ Database initialization failed:", error);
  process.exit(1);
}

db.close();
