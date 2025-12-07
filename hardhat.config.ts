import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    paths: {
        sources: "./contracts/contracts",
        tests: "./contracts/test",
        cache: "./contracts/cache",
        artifacts: "./contracts/artifacts",
    },
};

export default config;

