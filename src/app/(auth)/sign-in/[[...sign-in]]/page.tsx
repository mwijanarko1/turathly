import { SignIn } from "@clerk/nextjs";
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

export default function SignInPage() {
  return (
    <div className="w-full flex justify-center">
      <ClerkAuthGuard>
        <SignIn
          path="/sign-in"
          routing="path"
          fallback={<ClerkFallback />}
          signUpUrl="/sign-up"
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
    </div>
  );
}
