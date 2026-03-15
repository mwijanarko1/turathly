"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createContext, useContext, ReactNode } from "react";

const ConvexContext = createContext<{ available: boolean }>({ available: false });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

let convexClient: ConvexReactClient | null = null;
try {
  if (convexUrl) {
    convexClient = new ConvexReactClient(convexUrl);
  }
} catch (e) {
  console.warn("Convex client initialization failed:", e);
}

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!convexClient) {
    return (
      <ConvexContext.Provider value={{ available: false }}>
        {children}
      </ConvexContext.Provider>
    );
  }
  return (
    <ConvexContext.Provider value={{ available: true }}>
      <ConvexProvider client={convexClient}>{children}</ConvexProvider>
    </ConvexContext.Provider>
  );
}

export function useConvexAvailable() {
  const context = useContext(ConvexContext);
  return context?.available ?? false;
}