// Particle Network — Universal Account client stub.
//
// TODO(M2): install `@particle-network/universal-account-sdk` and wire up
// against the Magic-derived signer. This stub keeps the call surface stable so
// the rest of the app can import it today.

export type UniversalAccount = {
  address: `0x${string}`;
  unifiedBalance: Record<string, string>; // asset → balance (decimal string)
};

export async function provisionUniversalAccount(
  _signerAddress: `0x${string}`,
): Promise<UniversalAccount> {
  throw new Error("Not implemented — wire up in M2");
}

export async function sendUniversalTx(_args: {
  from: `0x${string}`;
  toChainId: number;
  to: `0x${string}`;
  data: `0x${string}`;
  value?: bigint;
  feeAsset?: string; // pay gas in this asset
}): Promise<`0x${string}`> {
  throw new Error("Not implemented — wire up in M4");
}
