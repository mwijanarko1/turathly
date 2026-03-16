"use client";

import Link from "next/link";
import Image from "next/image";
import { Show, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-transparent">
      <div className="max-w-7xl mx-auto px-6 py-3 text-base">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Turathly"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Turathly
            </span>
          </Link>

          {/* Centered Links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-base font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Auth: signed out = Sign In + Get Started (→ sign-in / sign-up); signed in = UserButton */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="text-base font-medium text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button
                  size="default"
                  className="bg-foreground text-background hover:bg-foreground/90 font-medium px-6 h-10 rounded-full text-base"
                >
                  Get Started
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}
