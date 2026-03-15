import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <BookOpen className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
            <span className="font-heading text-xl font-bold tracking-tight text-primary">
              Turathl<span className="text-accent italic">y</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <div className="h-4 w-px bg-border mx-1" />
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}