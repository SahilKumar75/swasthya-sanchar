import { formatEther } from "viem";
import hre from "hardhat";

async function main() {
  console.log("🏥 Deploying Swasthya Sanchar contracts...\n");

  // Get the contract to deploy
  const healthRecords = await hre.viem.deployContract("HealthRecords");

  console.log("✅ HealthRecords deployed to:", healthRecords.address);
  
  // Get deployer info
  const publicClient = await hre.viem.getPublicClient();
  const [deployer] = await hre.viem.getWalletClients();
  
  const balance = await publicClient.getBalance({ 
    address: deployer.account.address 
  });

  console.log("📍 Deployer address:", deployer.account.address);
  console.log("💰 Deployer balance:", formatEther(balance), "ETH");
  console.log("\n✨ Deployment complete!");
  console.log("\nContract addresses:");
  console.log("-------------------");
  console.log("HealthRecords:", healthRecords.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
