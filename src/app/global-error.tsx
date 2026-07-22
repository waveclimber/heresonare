"use client";

import { useEffect, useSyncExternalStore } from "react";

import { RuntimeErrorPage } from "@/components/RuntimeErrorPage";
import { interfaceContent } from "@/data/interfaceContent";
import {
  contentLanguageByLocale,
  defaultLocale,
  htmlLangByLocale,
  isLocale,
  type Locale,
} from "@/i18n/config";

import "./globals.css";

function getBrowserLocale(): Locale {
  const pathLocale = window.location.pathname.split("/").filter(Boolean)[0];
  return pathLocale && isLocale(pathLocale) ? pathLocale : defaultLocale;
}

function subscribeToLocale() {
  return () => undefined;
}

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getBrowserLocale,
    () => defaultLocale,
  );
  const language = contentLanguageByLocale[locale];
  const content = interfaceContent[language].runtimeError;

  useEffect(() => {
    console.error("Application shell rendering failed", {
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang={htmlLangByLocale[locale]}>
      <head>
        <title>{content.title} | héReSonare</title>
      </head>
      <body>
        <RuntimeErrorPage
          content={content}
          homeHref={`/${locale}`}
          onRetry={unstable_retry}
        />
      </body>
    </html>
  );
}
