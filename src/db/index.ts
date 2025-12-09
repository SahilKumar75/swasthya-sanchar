import { drizzle as drizzlePostgres } from "drizzle-orm/vercel-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { sql } from "@vercel/postgres";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { join } from "path";

// Check if we're in production (Vercel) or local development
const isProduction = process.env.VERCEL || process.env.POSTGRES_URL?.includes("vercel-storage");

let db: any; // Use 'any' to avoid union type conflicts

if (isProduction) {
  // Use Vercel Postgres in production
  console.log("[DB] Using Vercel Postgres (production)");
  db = drizzlePostgres(sql, { schema });
} else {
  // Use SQLite for local development
  console.log("[DB] Using SQLite (local development)");
  const dbPath = join(process.cwd(), "local.db");
  const sqlite = new Database(dbPath);
  db = drizzleSqlite(sqlite, { schema });
}

export { db };

// Export schema for use in queries
export { schema };
