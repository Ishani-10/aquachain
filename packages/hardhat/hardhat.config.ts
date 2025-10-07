import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import * as dotenv from "dotenv";

dotenv.config();

const DEV_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const PRIVATE_KEY = process.env.PRIVATE_KEY || DEV_PRIVATE_KEY;
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/";
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com/";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

// Setup network configs conditionally
const networks: any = {
  hardhat: {
    chainId: 31337,
  },
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
  },
};

// Only add Polygon networks if private key is properly set
if (PRIVATE_KEY && PRIVATE_KEY !== DEV_PRIVATE_KEY && PRIVATE_KEY.length === 66) {
  networks.polygonMumbai = {
    url: MUMBAI_RPC_URL,
    accounts: [PRIVATE_KEY],
    chainId: 80001,
    gasPrice: 20000000000,
  };

  networks.polygon = {
    url: POLYGON_RPC_URL,
    accounts: [PRIVATE_KEY],
    chainId: 137,
    gasPrice: 50000000000,
  };
}

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  defaultNetwork: "hardhat",
  networks,
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
    deployments: "./deployments",
  },
};