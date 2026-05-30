"use client";

import { useEffect } from "react";
import { useSession } from "@/store/session";

/**
 * Restores an existing Magic session (and re-provisions the Universal Account)
 * once on mount, so a returning user lands already connected. Render once near
 * the root.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const restore = useSession((s) => s.restore);
  useEffect(() => {
    void restore();
  }, [restore]);
  return <>{children}</>;
}
