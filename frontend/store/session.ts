"use client";

// Single source of truth for the authenticated session: the Magic user, their
// provisioned Particle Universal Account, and the unified balance. Components
// read from here via `useSession`; all login / deposit side-effects live here so
// the UI stays declarative.

import { create } from "zustand";
import * as magic from "@/lib/magic";
import type { MagicUser } from "@/lib/magic";
import {
  depositToAave,
  getUnifiedBalance,
  provisionUniversalAccount,
  type ProvisionedAccount,
} from "@/lib/particle";
import type { Asset, ChainId } from "@/lib/chains";

type Status = "idle" | "connecting" | "ready" | "error";

type SessionState = {
  user: MagicUser | null;
  account: ProvisionedAccount | null;
  /** Unified USD balance across all chains, or null until first fetched. */
  balanceUsd: number | null;
  status: Status;
  error: string | null;

  loginWithEmail: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  restore: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  deposit: (args: { asset: Asset; amount: string; chainId?: ChainId }) => Promise<string>;
  logout: () => Promise<void>;
};

export const useSession = create<SessionState>((set, get) => {
  /** Provision the UA for a freshly authenticated user and pull their balance. */
  async function activate(user: MagicUser) {
    const account = await provisionUniversalAccount(user.address);
    set({ user, account, status: "ready", error: null });
    void get().refreshBalance();
  }

  return {
    user: null,
    account: null,
    balanceUsd: null,
    status: "idle",
    error: null,

    async loginWithEmail(email) {
      set({ status: "connecting", error: null });
      try {
        await activate(await magic.loginWithEmail(email));
      } catch (e) {
        set({ status: "error", error: (e as Error).message });
        throw e;
      }
    },

    // Redirects away; the session is finished on the return page via restore().
    async loginWithGoogle() {
      set({ status: "connecting", error: null });
      await magic.loginWithGoogle();
    },

    async restore() {
      try {
        const user = await magic.restoreSession();
        if (user) await activate(user);
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },

    async refreshBalance() {
      const { account } = get();
      if (!account) return;
      try {
        const assets = await getUnifiedBalance(account.ua);
        set({ balanceUsd: assets.totalAmountInUSD });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },

    async deposit({ asset, amount, chainId }) {
      const { account } = get();
      if (!account) throw new Error("Connect an account first");
      const txId = await depositToAave({ account, asset, amount, chainId });
      void get().refreshBalance();
      return txId;
    },

    async logout() {
      await magic.logout();
      set({ user: null, account: null, balanceUsd: null, status: "idle" });
    },
  };
});
