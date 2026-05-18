import { fetchTopPools, pickBest, type Pool } from "./apy";
import type { Asset } from "./chains";

export type Route = {
  pool: Pool;
  estApy: number;
};

// TODO(M3/M4): incorporate bridge cost + gas estimate into the choice.
export async function bestRoute(asset: Asset): Promise<Route | null> {
  const pools = await fetchTopPools();
  const pool = pickBest(pools, asset);
  if (!pool) return null;
  return { pool, estApy: pool.apy };
}
