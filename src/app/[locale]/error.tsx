"use client";

import { useEffect } from "react";

import { RuntimeErrorPage } from "@/components/RuntimeErrorPage";
import { useLanguage } from "@/context/LanguageContext";
import { interfaceContent } from "@/data/interfaceContent";

export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { language, locale } = useLanguage();

  useEffect(() => {
    console.error("Localized route rendering failed", {
      digest: error.digest,
    });
  }, [error]);

  return (
    <RuntimeErrorPage
      content={interfaceContent[language].runtimeError}
      homeHref={`/${locale}`}
      onRetry={unstable_retry}
    />
  );
}
