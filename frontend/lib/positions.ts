// Real on-chain portfolio reader.
//
// Reads the Universal Account's actual Aave v3 positions (aToken balances) on
// the settlement chain, prices them with DefiLlama, and merges in the live APY
// for each market. No mock data — an account with no deposits returns [].

import { createPublicClient, formatUnits, http, type PublicClient } from "viem";
import {
  AAVE_V3_POOL,
  ASSET_DECIMALS,
  SETTLEMENT_CHAIN,
  SUPPORTED_ASSETS,
  tokenAddress,
  type Asset,
  type ChainId,
} from "./chains";
import { fetchTopPools } from "./apy";

const RPC: Partial<Record<ChainId, string>> = {
  42161:
    process.env.NEXT_PUBLIC_ARB_RPC ?? "https://arbitrum-one-rpc.publicnode.com",
};

const LLAMA_CHAIN_SLUG: Record<ChainId, string> = {
  1: "ethereum",
  10: "optimism",
  137: "polygon",
  8453: "base",
  42161: "arbitrum",
};

// Aave v3 Pool.getReserveData → we only need `aTokenAddress` out of the struct.
const POOL_ABI = [
  {
    type: "function",
    name: "getReserveData",
    stateMutability: "view",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "configuration", type: "tuple", components: [{ name: "data", type: "uint256" }] },
          { name: "liquidityIndex", type: "uint128" },
          { name: "currentLiquidityRate", type: "uint128" },
          { name: "variableBorrowIndex", type: "uint128" },
          { name: "currentVariableBorrowRate", type: "uint128" },
          { name: "currentStableBorrowRate", type: "uint128" },
          { name: "lastUpdateTimestamp", type: "uint40" },
          { name: "id", type: "uint16" },
          { name: "aTokenAddress", type: "address" },
          { name: "stableDebtTokenAddress", type: "address" },
          { name: "variableDebtTokenAddress", type: "address" },
          { name: "interestRateStrategyAddress", type: "address" },
          { name: "accruedToTreasury", type: "uint128" },
          { name: "unbacked", type: "uint128" },
          { name: "isolationModeTotalDebt", type: "uint128" },
        ],
      },
    ],
  },
] as const;

const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

export type Position = {
  asset: Asset;
  chainId: ChainId;
  protocol: "aave-v3";
  /** Supplied balance in token units (principal + accrued interest). */
  balance: number;
  /** USD value at the current price. */
  valueUsd: number;
  /** Live supply APY from DefiLlama for this market. */
  apy: number;
};

function client(chainId: ChainId): PublicClient {
  const rpc = RPC[chainId];
  if (!rpc) throw new Error(`No RPC configured for chain ${chainId}`);
  return createPublicClient({ transport: http(rpc) });
}

/** Current USD prices for the supported assets on a chain, via DefiLlama coins. */
async function fetchPrices(chainId: ChainId): Promise<Record<Asset, number>> {
  const slug = LLAMA_CHAIN_SLUG[chainId];
  const keys = SUPPORTED_ASSETS.map((a) => `${slug}:${tokenAddress(chainId, a)}`);
  const res = await fetch(`https://coins.llama.fi/prices/current/${keys.join(",")}`);
  const json = (await res.json()) as { coins: Record<string, { price: number }> };
  const out = {} as Record<Asset, number>;
  for (const a of SUPPORTED_ASSETS) {
    out[a] = json.coins[`${slug}:${tokenAddress(chainId, a)}`]?.price ?? 0;
  }
  return out;
}

/**
 * Read the account's live Aave v3 positions on the settlement chain. Returns
 * only assets with a non-zero supplied balance.
 */
export async function getPositions(
  account: `0x${string}`,
  chainId: ChainId = SETTLEMENT_CHAIN,
): Promise<Position[]> {
  const c = client(chainId);
  const pool = AAVE_V3_POOL[chainId];
  if (!pool) return [];

  const [pools, prices] = await Promise.all([
    fetchTopPools().catch(() => []),
    fetchPrices(chainId).catch(() => ({}) as Record<Asset, number>),
  ]);

  const positions: Position[] = [];
  for (const asset of SUPPORTED_ASSETS) {
    const underlying = tokenAddress(chainId, asset);
    try {
      const reserve = await c.readContract({
        address: pool,
        abi: POOL_ABI,
        functionName: "getReserveData",
        args: [underlying],
      });
      const aToken = reserve.aTokenAddress;
      const raw = await c.readContract({
        address: aToken,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [account],
      });
      if (raw === 0n) continue;

      const balance = Number(formatUnits(raw, ASSET_DECIMALS[asset]));
      const apy =
        pools.find(
          (p) => p.asset === asset && p.chainId === chainId && p.protocol === "aave-v3",
        )?.apy ?? 0;
      positions.push({
        asset,
        chainId,
        protocol: "aave-v3",
        balance,
        valueUsd: balance * (prices[asset] ?? 0),
        apy,
      });
    } catch {
      // Skip assets whose reserve read fails (e.g. asset not listed on the pool).
      continue;
    }
  }
  return positions;
}
