import { encodeFunctionData, parseUnits, type Hex } from "viem";
import {
  AAVE_V3_POOL,
  ASSET_DECIMALS,
  tokenAddress,
  type Asset,
  type ChainId,
} from "./chains";

/**
 * Minimal ABI for the two Aave v3 `Pool` entry points we use. `supply` deposits
 * an asset and credits aTokens to `onBehalfOf`; `withdraw` redeems them.
 */
const POOL_ABI = [
  {
    type: "function",
    name: "supply",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export type Call = { to: Hex; data: Hex; value?: bigint };

export function aavePool(chainId: ChainId): Hex {
  const pool = AAVE_V3_POOL[chainId];
  if (!pool) throw new Error(`No Aave v3 Pool registered for chain ${chainId}`);
  return pool;
}

/** Convert a human amount ("100", "0.5") to base units for the given asset. */
export function toBaseUnits(asset: Asset, amount: string): bigint {
  return parseUnits(amount, ASSET_DECIMALS[asset]);
}

/**
 * Build the `approve(pool, amount)` + `supply(asset, amount, onBehalfOf, 0)`
 * call sequence for an Aave v3 deposit. Returned as a batch so the caller (the
 * Particle Universal Account) can execute both atomically on the destination
 * chain.
 */
export function buildAaveSupply(args: {
  chainId: ChainId;
  asset: Asset;
  amount: string;
  onBehalfOf: Hex;
}): Call[] {
  const { chainId, asset, amount, onBehalfOf } = args;
  const token = tokenAddress(chainId, asset);
  const pool = aavePool(chainId);
  const value = toBaseUnits(asset, amount);

  const approve: Call = {
    to: token,
    data: encodeFunctionData({
      abi: ERC20_ABI,
      functionName: "approve",
      args: [pool, value],
    }),
  };

  const supply: Call = {
    to: pool,
    data: encodeFunctionData({
      abi: POOL_ABI,
      functionName: "supply",
      args: [token, value, onBehalfOf, 0],
    }),
  };

  return [approve, supply];
}

/** Build a single `withdraw(asset, amount, to)` call against the Aave Pool. */
export function buildAaveWithdraw(args: {
  chainId: ChainId;
  asset: Asset;
  amount: string;
  to: Hex;
}): Call {
  const { chainId, asset, amount, to } = args;
  const token = tokenAddress(chainId, asset);
  return {
    to: aavePool(chainId),
    data: encodeFunctionData({
      abi: POOL_ABI,
      functionName: "withdraw",
      args: [token, toBaseUnits(asset, amount), to],
    }),
  };
}
