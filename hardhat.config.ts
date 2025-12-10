import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    paths: {
        sources: "./contracts/contracts",
        tests: "./contracts/test",
        cache: "./contracts/cache",
        artifacts: "./contracts/artifacts",
    },
    networks: {
        // Local development network
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        // Polygon Amoy Testnet (for Vercel deployment)
        amoy: {
            url: "https://rpc-amoy.polygon.technology/",
            chainId: 80002,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};

export default config;

