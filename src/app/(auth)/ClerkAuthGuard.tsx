"use client";

/**
 * Wrapper for Clerk auth components. Renders children as-is.
 *
 * Clerk supports keyless mode: without env vars, it auto-generates temporary
 * keys and shows a "Claim your application" prompt. Do NOT block rendering
 * when keys are missing—that conflicts with Clerk's current quickstart.
 */
export function ClerkAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
