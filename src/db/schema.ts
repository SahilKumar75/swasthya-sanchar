import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users table - main authentication
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  walletAddress: text("wallet_address").unique(),
  role: text("role").notNull(), // "patient" | "doctor" | "admin"
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Patients table - additional patient data
export const patients = sqliteTable("patients", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull().unique(),
  name: text("name").notNull(),
  dateOfBirth: integer("date_of_birth", { mode: "timestamp" }).notNull(),
  
  // Personal Information (cached from blockchain)
  gender: text("gender"),
  bloodGroup: text("blood_group"),
  
  // Contact Information (cached from blockchain)
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  
  // Emergency Contact (cached from blockchain)
  emergencyName: text("emergency_name"),
  emergencyRelation: text("emergency_relation"),
  emergencyPhone: text("emergency_phone"),
  
  // Medical Information (cached from blockchain)
  allergies: text("allergies"),
  chronicConditions: text("chronic_conditions"),
  currentMedications: text("current_medications"),
  previousSurgeries: text("previous_surgeries"),
  
  // Blockchain tracking
  registeredOnBlockchain: integer("registered_on_blockchain", { mode: "boolean" }).default(false).notNull(),
  blockchainTxHash: text("blockchain_tx_hash"),
  lastSyncedAt: integer("last_synced_at", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Doctors table - additional doctor data
export const doctors = sqliteTable("doctors", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull().unique(),
  name: text("name").notNull(),
  licenseNumber: text("license_number").notNull(),
  specialization: text("specialization"),
  authorizedOnBlockchain: integer("authorized_on_blockchain", { mode: "boolean" }).default(false).notNull(),
  blockchainTxHash: text("blockchain_tx_hash"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type Doctor = typeof doctors.$inferSelect;
export type NewDoctor = typeof doctors.$inferInsert;
