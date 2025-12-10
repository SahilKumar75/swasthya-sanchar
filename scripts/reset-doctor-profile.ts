import { db } from "../src/db";
import { doctors, users } from "../src/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Reset doctor profile data while keeping the user account and wallet intact
 * This allows the doctor to re-enter their profile information
 */
async function resetDoctorProfile() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.error("❌ Please provide doctor email address");
      console.log("Usage: npm run reset-doctor-profile <email>");
      process.exit(1);
    }

    // Find the user
    const result = await db.query.users.findFirst({
      where: and(
        eq(users.email, email),
        eq(users.role, "doctor")
      ),
    });

    if (!result) {
      console.error(`❌ No doctor account found with email: ${email}`);
      process.exit(1);
    }

    console.log(`\n📋 Found doctor account:`);
    console.log(`   Email: ${result.email}`);
    console.log(`   Wallet: ${result.walletAddress || 'Not connected'}`);
    console.log(`   User ID: ${result.id}`);

    // Delete doctor profile data (if exists)
    const deleted = await db
      .delete(doctors)
      .where(eq(doctors.userId, result.id));

    console.log(`\n✅ Doctor profile data has been reset!`);
    console.log(`   User account remains intact`);
    console.log(`   Wallet connection preserved: ${result.walletAddress}`);
    console.log(`\n🔄 You can now log in and fill in your profile details fresh.\n`);

  } catch (error) {
    console.error("❌ Error resetting doctor profile:", error);
    process.exit(1);
  }
}

resetDoctorProfile();
