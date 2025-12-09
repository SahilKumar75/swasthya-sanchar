import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { join } from "path";
import * as schema from "./schema";

// Initialize SQLite database
const dbPath = join(process.cwd(), "local.db");
console.log("[Migration] Creating database at:", dbPath);
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

// Create tables
console.log("[Migration] Creating tables...");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    wallet_address TEXT UNIQUE,
    role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    date_of_birth INTEGER NOT NULL,
    registered_on_blockchain INTEGER DEFAULT 0,
    blockchain_tx_hash TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    specialization TEXT NOT NULL,
    authorized_on_blockchain INTEGER DEFAULT 0,
    blockchain_tx_hash TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

console.log("[Migration] ✅ Tables created successfully!");
console.log("[Migration] Database ready at: local.db");

sqlite.close();
