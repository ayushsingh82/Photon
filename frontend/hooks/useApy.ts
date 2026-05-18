"use client";

import { useEffect, useState } from "react";
import type { Asset } from "@/lib/chains";
import { bestRoute, type Route } from "@/lib/router";

export function useApy(asset: Asset) {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    bestRoute(asset)
      .then((r) => {
        if (!cancelled) setRoute(r);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [asset]);

  return { route, loading, error };
}
