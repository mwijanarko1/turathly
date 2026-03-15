import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <BookOpen className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-heading text-xl font-bold tracking-tight text-primary">
                Turathl<span className="text-accent italic">y</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              Advancing Islamic scholarship through context-aware AI translation tools.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-12 text-left">
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">Features</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">OCR Engine</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">Guides</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">Blog</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">About</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">Support</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">Legal</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground font-light tracking-wide">
            © {new Date().getFullYear()} Turathly. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary font-light transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary font-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}