"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { createContext, useContext, ReactNode, useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";

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

function ConvexUserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      return;
    }

    if (syncedUserIdRef.current === user.id) {
      return;
    }

    syncedUserIdRef.current = user.id;
    void ensureCurrentUser().catch((error) => {
      syncedUserIdRef.current = null;
      console.error("Failed to sync Clerk user with Convex:", error);
    });
  }, [ensureCurrentUser, isLoaded, isSignedIn, user?.id]);

  return null;
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
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        <ConvexUserSync />
        {children}
      </ConvexProviderWithClerk>
    </ConvexContext.Provider>
  );
}

export function useConvexAvailable() {
  const context = useContext(ConvexContext);
  return context?.available ?? false;
}
