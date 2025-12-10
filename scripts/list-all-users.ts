import { db } from "@/db";
import { users, patients, doctors } from "@/db/schema";

async function main() {
  console.log("📊 All Users in Database:");
  console.log("═════════════════════════════════════════════════════\n");

  const allUsers = await db.select().from(users);
  
  if (allUsers.length === 0) {
    console.log("❌ No users found in database");
    return;
  }

  for (const user of allUsers) {
    console.log("─────────────────────────────────────────────────────");
    console.log("User ID:", user.id);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Wallet Address:", user.walletAddress || "Not linked");
    console.log("Created:", user.createdAt);

    if (user.role === "patient") {
      const patient = await db.select().from(patients).where((table: any) => table.userId === user.id).limit(1);
      if (patient.length > 0) {
        console.log("  → Patient Name:", patient[0].name);
        console.log("  → Blood Group:", patient[0].bloodGroup || "N/A");
        console.log("  → Blockchain:", patient[0].registeredOnBlockchain ? "✅ Registered" : "❌ Not registered");
      }
    } else if (user.role === "doctor") {
      const doctor = await db.select().from(doctors).where((table: any) => table.userId === user.id).limit(1);
      if (doctor.length > 0) {
        console.log("  → Doctor Name:", doctor[0].name);
        console.log("  → License:", doctor[0].licenseNumber);
        console.log("  → Blockchain:", doctor[0].authorizedOnBlockchain ? "✅ Authorized" : "❌ Not authorized");
      }
    }
    console.log();
  }

  console.log("═════════════════════════════════════════════════════");
  console.log("Total users:", allUsers.length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
