import {
  LLAMA_CHAIN_TO_ID,
  SUPPORTED_ASSETS,
  type Asset,
  type ChainId,
} from "./chains";

export type Protocol = "aave-v3" | "morpho-blue";

export type Pool = {
  /** DefiLlama pool id — stable handle for the market. */
  id: string;
  asset: Asset;
  chainId: ChainId;
  chainName: string;
  protocol: Protocol;
  /** Total APY (base + reward), in percent. */
  apy: number;
  tvlUsd: number;
};

const LLAMA = process.env.NEXT_PUBLIC_DEFILLAMA_BASE ?? "https://yields.llama.fi";

/** Ignore dust markets — a "best APY" sitting on $20k of TVL isn't routable. */
const MIN_TVL_USD = 100_000;

/** Projects we settle into, keyed by DefiLlama's `project` slug. */
const PROTOCOLS: Record<string, Protocol> = {
  "aave-v3": "aave-v3",
  "morpho-blue": "morpho-blue",
};

/**
 * Raw row shape from DefiLlama `/pools`. Only the fields we read are typed; the
 * payload carries many more.
 */
type LlamaPool = {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  tvlUsd: number | null;
  stablecoin: boolean;
};

/**
 * Normalise a DefiLlama `symbol` to one of our supported assets, or `null` if it
 * is not a single-asset market we care about. Lending markets are listed under
 * the bare symbol ("USDC", "WETH"), so we reject anything containing a pair
 * separator ("-", "/") to avoid LP positions.
 */
function symbolToAsset(symbol: string): Asset | null {
  const s = symbol.toUpperCase();
  if (s.includes("-") || s.includes("/")) return null;
  if (s === "USDC" || s === "USDBC") return "USDC";
  if (s === "USDT") return "USDT";
  if (s === "WETH" || s === "ETH") return "ETH";
  return null;
}

/**
 * Fetch the live supply markets we route into. Filters DefiLlama's global pool
 * list down to Aave v3 / Morpho Blue lending markets for USDC / USDT / ETH on
 * our supported chains, then sorts by APY descending.
 *
 * Cached for 5 minutes at the fetch layer (Next.js data cache on the server;
 * the browser respects the same `revalidate` hint via the RSC fetch shim).
 */
export async function fetchTopPools(): Promise<Pool[]> {
  const res = await fetch(`${LLAMA}/pools`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`DefiLlama ${res.status}`);

  const json = (await res.json()) as { status: string; data: LlamaPool[] };
  const rows = Array.isArray(json.data) ? json.data : [];

  const pools: Pool[] = [];
  for (const row of rows) {
    const protocol = PROTOCOLS[row.project];
    if (!protocol) continue;

    const chainId = LLAMA_CHAIN_TO_ID[row.chain];
    if (!chainId) continue;

    const asset = symbolToAsset(row.symbol);
    if (!asset) continue;

    const apy = row.apy ?? (row.apyBase ?? 0) + (row.apyReward ?? 0);
    if (!Number.isFinite(apy) || apy <= 0) continue;

    const tvlUsd = row.tvlUsd ?? 0;
    if (tvlUsd < MIN_TVL_USD) continue;

    pools.push({
      id: row.pool,
      asset,
      chainId,
      chainName: row.chain,
      protocol,
      apy,
      tvlUsd,
    });
  }

  return pools.sort((a, b) => b.apy - a.apy);
}

/** Highest-APY market for a given asset (settlement-chain agnostic). */
export function pickBest(pools: Pool[], asset: Asset): Pool | undefined {
  return pools
    .filter((p) => p.asset === asset)
    .sort((a, b) => b.apy - a.apy)[0];
}

/** The single best market per supported asset — handy for dashboards. */
export function bestPerAsset(pools: Pool[]): Record<Asset, Pool | undefined> {
  const out = {} as Record<Asset, Pool | undefined>;
  for (const asset of SUPPORTED_ASSETS) out[asset] = pickBest(pools, asset);
  return out;
}
