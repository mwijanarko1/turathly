"use client";

import { useEffect, useRef } from "react";

const isDevelopment = process.env.NODE_ENV === "development";
const LOG_ENDPOINT = process.env.NEXT_PUBLIC_SIGNIN_DEBUG_ENDPOINT;
const SESSION_ID = process.env.NEXT_PUBLIC_SIGNIN_DEBUG_SESSION_ID ?? "local";

function log(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  if (!isDevelopment || !LOG_ENDPOINT) {
    return;
  }

  fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": SESSION_ID },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      location,
      message,
      data,
      hypothesisId,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}

export function SignInDebug() {
  const mounted = useRef(false);

  useEffect(() => {
    if (!isDevelopment || !LOG_ENDPOINT) {
      return;
    }

    if (mounted.current) return;
    mounted.current = true;

    // #region agent log
    const hasKey =
      typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0;
    log(
      "SignInDebug.tsx:mount",
      "SignIn page mounted",
      { publishableKeyPresent: hasKey },
      "H3"
    );
    // #endregion

    const t = setTimeout(() => {
      // #region agent log
      const hasClerkInput = document.querySelector('input[name="identifier"], input[name="password"], [data-clerk-input]');
      const hasClerkRoot = document.querySelector("[data-clerk-sign-in-root], .clerk-form");
      const clerkFormRendered = !!(hasClerkInput || hasClerkRoot);
      const hasClerkGlobal = typeof window !== "undefined" && "Clerk" in window;
      log(
        "SignInDebug.tsx:3s-check",
        "Post-mount check",
        {
          clerkFormRendered,
          hasClerkInput: !!hasClerkInput,
          hasClerkRoot: !!hasClerkRoot,
          hasClerkGlobal,
          bodyChildCount: document.body?.children?.length ?? 0,
        },
        "H1,H4,H5"
      );
      // #endregion
    }, 3000);

    return () => clearTimeout(t);
  }, []);

  return null;
}
