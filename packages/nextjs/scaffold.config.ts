import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.hardhat, chains.polygonMumbai, chains.polygon],
  // The interval at which your front-end polls the RPC servers for new data
  pollingInterval: 30000,
  // Alchemy API key for RPC access
  // Get your own at https://dashboard.alchemyapi.io
  // Store in .env.local: NEXT_PUBLIC_ALCHEMY_API_KEY
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
  // Custom RPC overrides for specific networks
  rpcOverrides: {
    [chains.polygonMumbai.id]: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
    [chains.polygon.id]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com",
  },
  // WalletConnect Project ID
  // Get your own at https://cloud.walletconnect.com
  // Store in .env.local: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  // Set to false to enable burner wallet on all networks (useful for testing)
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
