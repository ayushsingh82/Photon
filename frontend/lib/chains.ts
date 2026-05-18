export type ChainId = 1 | 10 | 137 | 8453 | 42161;

export const SUPPORTED_CHAINS: Record<
  ChainId,
  { name: string; short: string; rpcEnv: string }
> = {
  1: { name: "Ethereum", short: "eth", rpcEnv: "NEXT_PUBLIC_ETH_RPC" },
  10: { name: "Optimism", short: "op", rpcEnv: "NEXT_PUBLIC_OP_RPC" },
  137: { name: "Polygon", short: "pol", rpcEnv: "NEXT_PUBLIC_POL_RPC" },
  8453: { name: "Base", short: "base", rpcEnv: "NEXT_PUBLIC_BASE_RPC" },
  42161: { name: "Arbitrum", short: "arb", rpcEnv: "NEXT_PUBLIC_ARB_RPC" },
};

export const SETTLEMENT_CHAIN: ChainId = 42161;

export const SUPPORTED_ASSETS = ["USDC", "USDT", "ETH"] as const;
export type Asset = (typeof SUPPORTED_ASSETS)[number];
