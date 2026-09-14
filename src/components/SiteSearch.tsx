"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { searchContent } from "@/data/searchContent";
import type { ContentLanguage, Locale } from "@/i18n/config";
import { parseSearchIndex, searchEntries, searchQueryLimit, type SearchEntry } from "@/lib/siteSearch.mjs";

type SiteSearchProps = { language: ContentLanguage; locale: Locale; onOpen: () => void };

export default function SiteSearch({ language, locale, onOpen }: SiteSearchProps) {
  const [open, setOpen] = useState(false);
  const labels = searchContent[language];

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && !event.isComposing && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [onOpen]);

  return (
    <>
      <button type="button" className="site-search-trigger" aria-label={labels.open} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K" onClick={() => { onOpen(); setOpen(true); }}>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
      </button>
      {open && <SearchDialog language={language} locale={locale} onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchDialog({ language, locale, onClose }: Omit<SiteSearchProps, "onOpen"> & { onClose: () => void }) {
  const labels = searchContent[language];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [attempt, setAttempt] = useState(0);
  const results = searchEntries(entries, query);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let active = true;
    fetch(`/api/search?locale=${locale}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Search unavailable");
        const data = parseSearchIndex(await response.json(), locale);
        if (active) { setEntries(data); setStatus("ready"); }
      })
      .catch(() => { if (active) setStatus("failed"); })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [locale, attempt]);

  function retry() {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }

  function closeSearch() {
    // Close before unmounting so the native dialog restores its previous focus.
    dialogRef.current?.close();
    onClose();
  }

  return (
    <dialog ref={dialogRef} className="site-search-dialog" aria-labelledby="site-search-title" onCancel={(event) => { event.preventDefault(); closeSearch(); }}>
      <div className="flex max-h-[calc(100dvh-3rem)] flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
          <h2 id="site-search-title" className="text-xl font-semibold sm:text-2xl">{labels.title}</h2>
          <button type="button" className="site-search-trigger" aria-label={labels.close} onClick={closeSearch}><span aria-hidden="true">✕</span></button>
        </header>
        <div className="shrink-0 px-5 pt-5 pb-4 sm:px-8" role="search" aria-label={labels.open}>
          <label htmlFor="site-search-input" className="sr-only">{labels.open}</label>
          <input ref={inputRef} id="site-search-input" type="search" autoComplete="off" spellCheck={false} value={query} maxLength={searchQueryLimit} onChange={(event) => setQuery(event.target.value)} placeholder={labels.placeholder} aria-describedby="site-search-hint" className="inquiry-field" />
          <p id="site-search-hint" className="mt-3 text-xs leading-5 text-gray-400">{labels.hint}</p>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-8">
          <p role="status" aria-atomic="true" className="mb-3 text-sm text-gray-400">
            {status === "loading" ? labels.loading : status === "failed" ? labels.failed : query.trim() ? labels.resultCount.replace("{count}", String(results.length)) : labels.suggestions}
          </p>
          {status === "failed" && <button type="button" onClick={retry} className="email-copy-button">{labels.retry}</button>}
          {status === "ready" && results.length === 0 && (
            <div className="rounded-2xl border border-white/10 px-5 py-8">
              <h3 className="text-lg font-medium">{labels.empty}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">{labels.emptyHint}</p>
              <button type="button" className="email-copy-button mt-5" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>{labels.clear}</button>
            </div>
          )}
          {status === "ready" && results.length > 0 && (
            <ul className="space-y-2">
              {results.map((entry) => (
                <li key={entry.href}>
                  <Link href={entry.href} prefetch={false} className="site-search-result" onClick={(event) => {
                    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) closeSearch();
                  }}>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--brand-teal)]">{entry.label}{entry.status && <span className="text-gray-400">{entry.status}</span>}</span>
                    <span className="mt-1 block text-base font-medium text-white">{entry.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-gray-400">{entry.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  );
}
