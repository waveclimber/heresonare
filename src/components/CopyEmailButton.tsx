"use client";

import { useEffect, useRef, useState } from "react";
import { interfaceContent } from "@/data/interfaceContent";
import type { ContentLanguage } from "@/i18n/config";

export default function CopyEmailButton({
  email,
  language,
}: {
  email: string;
  language: ContentLanguage;
}) {
  const [status, setStatus] = useState<
    "idle" | "copying" | "copied" | "failed"
  >("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const labels = interfaceContent[language].email;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyEmail() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(email);
      if (!mounted.current) return;
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 4000);
    } catch {
      if (mounted.current) setStatus("failed");
    }
  }

  return (
    <div className="max-w-full">
      <button
        type="button"
        onClick={copyEmail}
        disabled={status === "copying"}
        aria-label={`${labels.copy}: ${email}`}
        className="resonance-control email-copy-button"
      >
        {status === "copied" ? labels.copied : labels.copy}
      </button>
      <p
        role="status"
        aria-atomic="true"
        className={status === "failed" ? "mt-3 max-w-sm text-sm leading-6 text-gray-300" : "sr-only"}
      >
        {status === "copied" ? labels.copied : status === "failed" ? labels.failed : ""}
      </p>
      {status === "failed" && (
        <input
          type="text"
          readOnly
          value={email}
          aria-label={labels.address}
          onFocus={(event) => event.currentTarget.select()}
          onClick={(event) => event.currentTarget.select()}
          className="mt-2 min-h-11 w-full min-w-0 select-all rounded-xl border border-white/20 bg-black/40 px-3 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-yellow)]"
        />
      )}
    </div>
  );
}
