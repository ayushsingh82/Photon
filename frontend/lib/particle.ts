// Particle Network — Universal Account integration.
//
// A Universal Account (UA) is one smart account that holds a *unified* balance
// across every supported chain. The user's Magic EOA owns it. When we deposit,
// Particle sources the funds from wherever they sit, bridges, sponsors gas, and
// executes the destination call — all from a single signed `rootHash`.
//
// Owner (Magic EOA) ──signs rootHash──▶ Universal Account ──routes──▶ Aave on Arbitrum

import { getBytes } from "ethers";
import {
  CHAIN_ID,
  SUPPORTED_TOKEN_TYPE,
  UniversalAccount,
  type IAssetsResponse,
} from "@particle-network/universal-account-sdk";
import { getSigner } from "./magic";
import { buildAaveSupply, type Call } from "./aave";
import { SETTLEMENT_CHAIN, type Asset, type ChainId } from "./chains";

const PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID;
const CLIENT_KEY = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY;
const APP_ID =
  process.env.NEXT_PUBLIC_PARTICLE_APP_ID ?? process.env.PARTICLE_APP_ID;

export type ProvisionedAccount = {
  ua: UniversalAccount;
  /** The EVM smart-account address that actually holds positions on-chain. */
  address: `0x${string}`;
  /** Owner EOA (the Magic-derived signer). */
  owner: `0x${string}`;
};

/** Map our settlement chains to the SDK's CHAIN_ID enum (values are the chain ids). */
const CHAIN: Record<ChainId, CHAIN_ID> = {
  1: CHAIN_ID.ETHEREUM_MAINNET,
  10: CHAIN_ID.OPTIMISM_MAINNET,
  137: CHAIN_ID.POLYGON_MAINNET,
  8453: CHAIN_ID.BASE_MAINNET,
  42161: CHAIN_ID.ARBITRUM_MAINNET_ONE,
};

const TOKEN_TYPE: Record<Asset, SUPPORTED_TOKEN_TYPE> = {
  USDC: SUPPORTED_TOKEN_TYPE.USDC,
  USDT: SUPPORTED_TOKEN_TYPE.USDT,
  ETH: SUPPORTED_TOKEN_TYPE.ETH,
};

function particleConfig(): {
  projectId: string;
  projectClientKey: string;
  projectAppUuid: string;
} {
  if (!PROJECT_ID || !CLIENT_KEY || !APP_ID) {
    throw new Error(
      "Particle is not configured — set NEXT_PUBLIC_PARTICLE_PROJECT_ID, " +
        "NEXT_PUBLIC_PARTICLE_CLIENT_KEY and NEXT_PUBLIC_PARTICLE_APP_ID",
    );
  }
  return {
    projectId: PROJECT_ID,
    projectClientKey: CLIENT_KEY,
    projectAppUuid: APP_ID,
  };
}

/**
 * Build a Universal Account owned by the given Magic EOA and resolve its
 * on-chain smart-account address.
 */
export async function provisionUniversalAccount(
  ownerAddress: `0x${string}`,
): Promise<ProvisionedAccount> {
  const ua = new UniversalAccount({
    ...particleConfig(),
    ownerAddress,
    // 1% slippage tolerance on the cross-chain routing swaps; pay gas in-asset.
    tradeConfig: { slippageBps: 100, universalGas: true },
  });

  const options = await ua.getSmartAccountOptions();
  return {
    ua,
    address: (options.smartAccountAddress ?? ownerAddress) as `0x${string}`,
    owner: ownerAddress,
  };
}

/** The user's unified balance across all chains, in USD plus per-asset detail. */
export async function getUnifiedBalance(
  ua: UniversalAccount,
): Promise<IAssetsResponse> {
  return ua.getPrimaryAssets();
}

/**
 * Sign and broadcast a Universal Transaction. The owner (Magic) signs the
 * single `rootHash`; Particle handles sourcing, bridging, gas and execution.
 * Returns the Particle transaction id for status polling.
 */
async function sendUniversal(
  ua: UniversalAccount,
  toChainId: ChainId,
  asset: Asset,
  amount: string,
  calls: Call[],
): Promise<string> {
  const transaction = await ua.createUniversalTransaction({
    chainId: CHAIN[toChainId],
    expectTokens: [{ type: TOKEN_TYPE[asset], amount }],
    transactions: calls.map((c) => ({
      to: c.to,
      data: c.data,
      value: c.value ? `0x${c.value.toString(16)}` : "0x0",
    })),
  });

  const signer = await getSigner();
  const signature = await signer.signMessage(getBytes(transaction.rootHash));
  const result = await ua.sendTransaction(transaction, signature);
  return result.transactionId as string;
}

/**
 * Deposit `amount` of `asset` into Aave v3 on the destination chain (Arbitrum by
 * default), crediting aTokens to the Universal Account. One signature; Particle
 * does the rest. Returns the Particle transaction id.
 */
export async function depositToAave(args: {
  account: ProvisionedAccount;
  asset: Asset;
  amount: string;
  chainId?: ChainId;
}): Promise<string> {
  const { account, asset, amount, chainId = SETTLEMENT_CHAIN } = args;
  const calls = buildAaveSupply({
    chainId,
    asset,
    amount,
    onBehalfOf: account.address,
  });
  return sendUniversal(account.ua, chainId, asset, amount, calls);
}
