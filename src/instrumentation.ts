import type { Instrumentation } from "next";

import { createServerErrorEvent } from "@/observability/serverErrorEvent.mjs";

export const onRequestError: Instrumentation.onRequestError = (
  error,
  request,
  context,
) => {
  const event = createServerErrorEvent(error, request, context, {
    timestamp: new Date().toISOString(),
    eventId: globalThis.crypto.randomUUID(),
    runtime: process.env.NEXT_RUNTIME,
    environment: process.env.NODE_ENV,
  });

  console.error(JSON.stringify(event));
};
