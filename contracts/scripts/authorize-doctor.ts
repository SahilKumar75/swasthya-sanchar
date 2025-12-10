import hre from "hardhat";

async function main() {
  // Get the doctor address from command line or use a default
  const doctorAddress = process.env.DOCTOR_ADDRESS || process.argv[2];
  
  if (!doctorAddress) {
    console.error("❌ Error: Please provide a doctor address");
    console.log("Usage: DOCTOR_ADDRESS=0x... npx hardhat run scripts/authorize-doctor.ts --network localhost");
    process.exit(1);
  }

  // Validate address format
  if (!doctorAddress.startsWith("0x") || doctorAddress.length !== 42) {
    console.error("❌ Error: Invalid Ethereum address format");
    process.exit(1);
  }

  console.log("🏥 Authorizing Doctor...");
  console.log("Doctor Address:", doctorAddress);

  // Get the deployed contract address
  const contractAddress = process.env.HEALTH_RECORDS_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  console.log("Contract Address:", contractAddress);

  // Get the contract
  const healthRecords = await hre.viem.getContractAt("HealthRecords", contractAddress as `0x${string}`);

  // Get the signer (should be the admin account that deployed the contract)
  const [admin] = await hre.viem.getWalletClients();
  console.log("Admin Address:", admin.account.address);

  // Check if doctor is already authorized
  const isAlreadyAuthorized = await healthRecords.read.authorizedDoctors([doctorAddress as `0x${string}`]);
  if (isAlreadyAuthorized) {
    console.log("✅ Doctor is already authorized!");
    return;
  }

  // Authorize the doctor
  console.log("📝 Sending authorization transaction...");
  const tx = await healthRecords.write.authorizeDoctor([doctorAddress as `0x${string}`]);
  console.log("Transaction hash:", tx);
  
  console.log("⏳ Waiting for confirmation...");
  const publicClient = await hre.viem.getPublicClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
  
  console.log("✅ Doctor authorized successfully!");
  console.log("Block number:", receipt.blockNumber);
  console.log("Gas used:", receipt.gasUsed.toString());

  // Verify authorization
  const isAuthorized = await healthRecords.read.authorizedDoctors([doctorAddress as `0x${string}`]);
  console.log("\n🔍 Verification:");
  console.log("Doctor authorized:", isAuthorized);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
