// Magic Labs SDK client — seedless social / email login.
//
// Magic gives us a non-custodial EOA per user. That EOA becomes the *owner*
// (signer) of the Particle Universal Account (see lib/particle.ts): Magic
// proves identity and signs, Particle abstracts chains and gas.
//
// Everything here is browser-only. The SDK touches `window`, so we lazily
// construct the client and guard against SSR.

import { BrowserProvider, type Eip1193Provider, type JsonRpcSigner } from "ethers";

export type MagicUser = {
  email: string | null;
  address: `0x${string}`;
};

const MAGIC_KEY = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;

// Cached singleton — Magic must be instantiated exactly once per page load.
let magicPromise: Promise<MagicInstance> | null = null;

// The Magic SDK is loaded dynamically so it never ends up in a server bundle.
// We keep the surface we use narrowly typed rather than pulling the full types.
type MagicInstance = {
  auth: { loginWithEmailOTP: (args: { email: string }) => Promise<string | null> };
  oauth2: {
    loginWithRedirect: (args: { provider: string; redirectURI: string }) => Promise<void>;
    getRedirectResult: () => Promise<unknown>;
  };
  user: {
    isLoggedIn: () => Promise<boolean>;
    logout: () => Promise<boolean>;
    getInfo: () => Promise<{ publicAddress: string | null; email: string | null }>;
  };
  rpcProvider: Eip1193Provider;
};

export async function getMagic(): Promise<MagicInstance> {
  if (typeof window === "undefined") {
    throw new Error("Magic can only run in the browser");
  }
  if (!MAGIC_KEY) {
    throw new Error("NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY is not set");
  }
  if (!magicPromise) {
    magicPromise = (async () => {
      const [{ Magic }, { OAuthExtension }] = await Promise.all([
        import("magic-sdk"),
        import("@magic-ext/oauth2"),
      ]);
      return new Magic(MAGIC_KEY, {
        extensions: [new OAuthExtension()],
      }) as unknown as MagicInstance;
    })();
  }
  return magicPromise;
}

/** An ethers v6 signer backed by the Magic provider — used to sign Particle's rootHash. */
export async function getSigner(): Promise<JsonRpcSigner> {
  const magic = await getMagic();
  const provider = new BrowserProvider(magic.rpcProvider);
  return provider.getSigner();
}

async function currentUser(magic: MagicInstance): Promise<MagicUser> {
  const info = await magic.user.getInfo();
  if (!info.publicAddress) throw new Error("Magic returned no address");
  return {
    email: info.email,
    address: info.publicAddress as `0x${string}`,
  };
}

/** Email one-time-passcode login. Resolves once the user completes the OTP. */
export async function loginWithEmail(email: string): Promise<MagicUser> {
  const magic = await getMagic();
  await magic.auth.loginWithEmailOTP({ email });
  return currentUser(magic);
}

/** Kick off a Google OAuth redirect. Control returns via `completeOAuthLogin`. */
export async function loginWithGoogle(): Promise<void> {
  const magic = await getMagic();
  await magic.oauth2.loginWithRedirect({
    provider: "google",
    redirectURI: `${window.location.origin}/dashboard`,
  });
}

/** Call on the redirect landing page to finish an OAuth login. */
export async function completeOAuthLogin(): Promise<MagicUser> {
  const magic = await getMagic();
  await magic.oauth2.getRedirectResult();
  return currentUser(magic);
}

/** Restore an existing session on page load, or null if not logged in. */
export async function restoreSession(): Promise<MagicUser | null> {
  const magic = await getMagic();
  if (!(await magic.user.isLoggedIn())) return null;
  return currentUser(magic);
}

export async function logout(): Promise<void> {
  const magic = await getMagic();
  await magic.user.logout();
}
