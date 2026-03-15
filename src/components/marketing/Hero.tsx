import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Languages, Search, FileText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-32 pb-24">
      {/* Background patterns */}
      <div className="absolute inset-0 grid-background pointer-events-none opacity-40 z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-20">
        <div className="mb-6 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-primary font-semibold uppercase tracking-wider">
            Now with advanced Arabic OCR
          </span>
        </div>
        
        <h1 className="font-heading text-5xl md:text-8xl font-bold text-foreground mb-8 tracking-tighter leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Translate Islamic texts
          <br />
          <span className="text-primary italic font-medium">with scholarship.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          A translation workbench designed for scholars and students working with classical Arabic manuscripts and Islamic books.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Link href="/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 h-14 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all active:scale-95 group">
              Start Translating
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="ghost" size="lg" className="text-lg px-8 h-14 rounded-full hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all">
              See how it works
            </Button>
          </Link>
        </div>
      </div>

      {/* The Scholarly Workbench Mockup */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 mt-10 animate-in fade-in slide-in-from-bottom-24 duration-1500 delay-700">
        <div className="relative rounded-2xl p-2 bg-white/50 backdrop-blur-sm border border-border shadow-2xl overflow-hidden group">
          <div className="rounded-xl overflow-hidden border border-border bg-background aspect-[16/10] sm:aspect-[16/9] flex flex-col">
            {/* Toolbar mockup */}
            <div className="h-12 border-b border-border bg-muted/30 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                <div className="w-3 h-3 rounded-full bg-green-400/50" />
              </div>
              <div className="flex items-center gap-4 bg-background border border-border rounded-md px-3 py-1 text-xs text-muted-foreground font-medium w-1/3">
                <Search className="w-3 h-3" />
                <span>Search in document...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20" />
                <div className="w-8 h-8 rounded bg-secondary/10 border border-secondary/20" />
              </div>
            </div>

            {/* Content Mockup */}
            <div className="flex-1 grid grid-cols-3 divide-x divide-border">
              {/* Column 1: Source PDF */}
              <div className="p-4 flex flex-col gap-4 overflow-hidden relative">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Source Page
                </div>
                <div className="flex-1 rounded border border-border bg-muted/10 p-4 font-arabic text-right text-lg text-primary opacity-30 select-none">
                  <div className="h-4 w-3/4 bg-primary/20 rounded mr-auto mb-3" />
                  <div className="h-4 w-full bg-primary/20 rounded mb-3" />
                  <div className="h-4 w-5/6 bg-primary/20 rounded mr-auto mb-3" />
                  <div className="h-4 w-full bg-primary/20 rounded mb-3" />
                  <div className="h-4 w-2/3 bg-primary/20 rounded mr-auto" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
              </div>

              {/* Column 2: OCR Arabic */}
              <div className="p-4 flex flex-col gap-4 overflow-hidden relative bg-muted/5">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Extracted Arabic
                </div>
                <div className="flex-1 font-arabic text-right text-xl leading-relaxed text-foreground animate-pulse">
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  <br />
                  الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
                  <br />
                  الرَّحْمَنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ
                  <br />
                  إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
                  <br />
                  اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
              </div>

              {/* Column 3: Translation */}
              <div className="p-4 flex flex-col gap-4 overflow-hidden relative">
                <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Languages className="w-3 h-3" /> Translation Draft
                </div>
                <div className="flex-1 font-sans text-sm leading-relaxed text-foreground/80 space-y-3">
                  <div className="p-2 rounded bg-accent/5 border-l-2 border-accent mb-2">
                    <p className="font-semibold text-accent text-[10px] uppercase mb-1">AI Suggestion</p>
                    <p>In the name of Allah, the Most Gracious, the Most Merciful.</p>
                  </div>
                  <p>All praise is due to Allah, Lord of all the worlds.</p>
                  <p>The Entirely Merciful, the Especially Merciful.</p>
                  <p>Sovereign of the Day of Recompense.</p>
                  <p className="animate-pulse">It is You we worship and You we ask for help...</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Glow effects */}
          <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-primary/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />
          <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-accent/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-accent/20 transition-colors duration-1000" />
        </div>
      </div>
    </section>
  );
}