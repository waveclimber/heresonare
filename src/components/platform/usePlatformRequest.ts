"use client";
import { useState, useSyncExternalStore } from "react";
import type { PlatformCopy } from "@/data/platformContent";
const subscribe = () => () => {};
export function usePlatformRequest(copy: PlatformCopy) {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function request(path: string, body: unknown) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(path, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error);
      return value as { reference?: string; id?: string };
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : "";
      setError(copy.errors[code as keyof typeof copy.errors] ?? copy.error);
      return null;
    } finally {
      setBusy(false);
    }
  }
  return { ready, busy, error, request };
}
