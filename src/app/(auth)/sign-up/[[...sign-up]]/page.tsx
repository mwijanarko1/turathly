import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { ClerkAuthGuard } from "../../ClerkAuthGuard";

function ClerkFallback() {
  return (
    <div className="w-[380px] rounded-xl border border-border bg-card p-8 shadow-lg animate-pulse">
      <div className="h-6 w-32 bg-muted rounded mb-2" />
      <div className="h-4 w-full bg-muted rounded mb-6" />
      <div className="h-10 w-full bg-muted rounded mb-4" />
      <div className="h-10 w-full bg-muted rounded" />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <ClerkAuthGuard>
        <SignUp
          path="/sign-up"
          routing="path"
          fallback={<ClerkFallback />}
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-lg",
              headerTitle: "font-heading text-2xl",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              footerActionLink: "text-primary hover:text-primary/80",
            },
          }}
        />
      </ClerkAuthGuard>
      <p className="text-xs text-muted-foreground text-center max-w-[380px]">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:text-primary/80 underline underline-offset-2">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:text-primary/80 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
