import { formatEther, parseGwei } from "viem";
import hre from "hardhat";

async function main() {
  console.log("🏥 Deploying Swasthya Sanchar contracts to Polygon Amoy...\n");

  const publicClient = await hre.viem.getPublicClient();
  const [deployer] = await hre.viem.getWalletClients();
  
  // Check balance first
  const balance = await publicClient.getBalance({ 
    address: deployer.account.address 
  });

  console.log("📍 Deployer address:", deployer.account.address);
  console.log("💰 Deployer balance:", formatEther(balance), "MATIC");
  
  if (balance === 0n) {
    console.error("\n❌ ERROR: No MATIC balance!");
    console.error("Please get testnet MATIC from: https://faucet.polygon.technology/");
    console.error("Select 'Polygon Amoy' and paste your address:", deployer.account.address);
    process.exit(1);
  }

  console.log("\n⏳ Deploying contract (this may take 30-60 seconds)...\n");

  try {
    // Deploy with explicit gas settings for Polygon Amoy
    const healthRecords = await hre.viem.deployContract("HealthRecords", [], {
      gasPrice: parseGwei("50"), // 50 gwei - sufficient for Amoy
    });

    console.log("✅ HealthRecords deployed to:", healthRecords.address);
    
    // Get final balance
    const finalBalance = await publicClient.getBalance({ 
      address: deployer.account.address 
    });
    
    console.log("💰 Remaining balance:", formatEther(finalBalance), "MATIC");
    console.log("\n✨ Deployment complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Copy this contract address:", healthRecords.address);
    console.log("2. Update src/lib/contracts.ts line 463 with this address");
    console.log("3. Commit and push to GitHub");
    console.log("4. Vercel will auto-deploy your app");
    console.log("\n🔍 Verify on block explorer:");
    console.log(`https://amoy.polygonscan.com/address/${healthRecords.address}`);
  } catch (error: any) {
    console.error("\n❌ Deployment failed!");
    
    if (error.message?.includes("insufficient")) {
      console.error("\nInsufficient funds. You need more testnet MATIC.");
      console.error("Current balance:", formatEther(balance), "MATIC");
      console.error("\nGet more from these faucets:");
      console.error("1. https://faucet.polygon.technology/");
      console.error("2. https://www.alchemy.com/faucets/polygon-amoy");
      console.error("3. https://stakely.io/en/faucet/polygon-amoy-testnet");
    } else {
      console.error("Error:", error.message);
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
