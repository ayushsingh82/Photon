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

/**
 * DefiLlama labels chains with human names ("Arbitrum", "Ethereum", …). Map the
 * subset we support back to a numeric chainId so the rest of the app can stay
 * id-based. Anything not in this table is filtered out upstream.
 */
export const LLAMA_CHAIN_TO_ID: Record<string, ChainId> = {
  Ethereum: 1,
  Optimism: 10,
  Polygon: 137,
  Base: 8453,
  Arbitrum: 42161,
};

/** Short slug used by the logo registry (`lib/assets.ts`). */
export const CHAIN_SLUG: Record<ChainId, string> = {
  1: "ethereum",
  10: "optimism",
  137: "polygon",
  8453: "base",
  42161: "arbitrum",
};

/**
 * ERC-20 addresses per chain for the assets we route. ETH is represented by its
 * canonical wrapped token (WETH) since Aave/Morpho markets are denominated in
 * WETH. Addresses are checksummed mainnet deployments.
 */
export const TOKEN_ADDRESS: Record<ChainId, Partial<Record<Asset, `0x${string}`>>> = {
  1: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    ETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  10: {
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    ETH: "0x4200000000000000000000000000000000000006",
  },
  137: {
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    ETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  },
  8453: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    ETH: "0x4200000000000000000000000000000000000006",
  },
  42161: {
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    ETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  },
};

/** Aave v3 `Pool` contract per chain (the proxy you call `supply`/`withdraw` on). */
export const AAVE_V3_POOL: Partial<Record<ChainId, `0x${string}`>> = {
  1: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
  10: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  137: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  8453: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
  42161: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
};

export function tokenAddress(chainId: ChainId, asset: Asset): `0x${string}` {
  const addr = TOKEN_ADDRESS[chainId]?.[asset];
  if (!addr) {
    throw new Error(`No ${asset} address registered for chain ${chainId}`);
  }
  return addr;
}

/** ERC-20 decimals for the supported assets (USDC/USDT are 6, ETH/WETH is 18). */
export const ASSET_DECIMALS: Record<Asset, number> = {
  USDC: 6,
  USDT: 6,
  ETH: 18,
};
