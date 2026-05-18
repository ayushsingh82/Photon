// Magic Labs SDK client stub.
//
// TODO(M1): install `magic-sdk` and `@magic-ext/oauth` and replace the stub
// below with the real client. Kept as a no-op for the initial scaffold so the
// app builds without secrets.

export type MagicUser = {
  email: string | null;
  address: `0x${string}`;
};

export async function getMagicClient(): Promise<unknown> {
  if (!process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY is not set");
  }
  // const { Magic } = await import("magic-sdk");
  // return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, { ... });
  throw new Error("Magic SDK not yet wired — see frontend/lib/magic.ts");
}

export async function loginWithEmail(_email: string): Promise<MagicUser> {
  throw new Error("Not implemented — wire up in M1");
}
