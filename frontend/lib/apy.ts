import type { Asset, ChainId } from "./chains";

export type Pool = {
  asset: Asset;
  chainId: ChainId;
  chainName: string;
  protocol: "aave-v3" | "morpho-blue";
  apy: number;
  tvlUsd: number;
};

const LLAMA = process.env.NEXT_PUBLIC_DEFILLAMA_BASE ?? "https://yields.llama.fi";

// TODO(M3): replace with a typed fetch + cache layer (TanStack Query on client,
// in-memory or Redis on server).
export async function fetchTopPools(): Promise<Pool[]> {
  const res = await fetch(`${LLAMA}/pools`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`DefiLlama ${res.status}`);
  const json = (await res.json()) as { data: unknown[] };
  // Real filtering / mapping deferred to M3.
  return json.data.slice(0, 0) as Pool[];
}

export function pickBest(pools: Pool[], asset: Asset): Pool | undefined {
  return pools
    .filter((p) => p.asset === asset)
    .sort((a, b) => b.apy - a.apy)[0];
}
