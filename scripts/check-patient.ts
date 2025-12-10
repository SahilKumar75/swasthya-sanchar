import { db } from "@/db";
import { users, patients } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const walletAddress = process.env.WALLET_ADDRESS || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  
  console.log("🔍 Searching for wallet address:", walletAddress);
  console.log("─────────────────────────────────────────────────────\n");

  // Check if user exists with this wallet
  const user = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
  
  if (user.length === 0) {
    console.log("❌ No user found with this wallet address");
    console.log("\nThis wallet address is not registered in the database.");
    console.log("It may be connected via MetaMask but not linked to any user account.");
    return;
  }

  console.log("✅ User found!");
  console.log("─────────────────────────────────────────────────────");
  console.log("User ID:", user[0].id);
  console.log("Email:", user[0].email);
  console.log("Role:", user[0].role);
  console.log("Wallet Address:", user[0].walletAddress);
  console.log("Created At:", user[0].createdAt);
  console.log("\n");

  // If patient, get patient details
  if (user[0].role === "patient") {
    const patient = await db.select().from(patients).where(eq(patients.userId, user[0].id)).limit(1);
    
    if (patient.length > 0) {
      console.log("📋 Patient Details:");
      console.log("─────────────────────────────────────────────────────");
      console.log("Name:", patient[0].name);
      console.log("Date of Birth:", patient[0].dateOfBirth);
      console.log("Gender:", patient[0].gender || "N/A");
      console.log("Blood Group:", patient[0].bloodGroup || "N/A");
      console.log("\n📞 Contact Information:");
      console.log("Phone:", patient[0].phone || "N/A");
      console.log("Email:", patient[0].email || "N/A");
      console.log("Address:", patient[0].address || "N/A");
      console.log("City:", patient[0].city || "N/A");
      console.log("State:", patient[0].state || "N/A");
      console.log("Pincode:", patient[0].pincode || "N/A");
      console.log("\n🚨 Emergency Contact:");
      console.log("Name:", patient[0].emergencyName || "N/A");
      console.log("Relation:", patient[0].emergencyRelation || "N/A");
      console.log("Phone:", patient[0].emergencyPhone || "N/A");
      console.log("\n💊 Medical Information:");
      console.log("Allergies:", patient[0].allergies || "N/A");
      console.log("Chronic Conditions:", patient[0].chronicConditions || "N/A");
      console.log("Current Medications:", patient[0].currentMedications || "N/A");
      console.log("Previous Surgeries:", patient[0].previousSurgeries || "N/A");
      console.log("\n📏 Physical Measurements:");
      console.log("Height:", patient[0].height || "N/A");
      console.log("Weight:", patient[0].weight || "N/A");
      console.log("Waist Circumference:", patient[0].waistCircumference || "N/A");
      console.log("Last Checked:", patient[0].lastCheckedDate || "N/A");
      console.log("\n⛓️ Blockchain Status:");
      console.log("Registered on Blockchain:", patient[0].registeredOnBlockchain ? "Yes ✅" : "No ❌");
      console.log("Transaction Hash:", patient[0].blockchainTxHash || "N/A");
      console.log("Last Synced:", patient[0].lastSyncedAt || "N/A");
    } else {
      console.log("⚠️ User is a patient but no patient profile found in database");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
