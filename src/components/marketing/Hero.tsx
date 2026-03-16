import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Languages,
  Search,
  FileText,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden pt-32 pb-24">
      {/* Painterly background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[80%] opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] opacity-10 blur-[72px] bg-primary/20 rotate-12" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] opacity-10 blur-[88px] bg-accent/20 -rotate-12" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.12),transparent_20%)] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-4xl text-left">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 tracking-tighter leading-[1.05]">
            Context-aware AI translations <br />
            for Islamic texts.
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-start gap-5">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 text-base md:text-lg px-6 md:px-8 h-11 md:h-12 rounded-full"
              >
                Start Translating
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 w-4 h-4 md:w-5 md:h-5"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* The Scholarly Workbench Mockup */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
        <div className="relative rounded-2xl p-2 bg-white/50 border border-border shadow-2xl overflow-hidden">
          <div className="rounded-xl overflow-hidden border border-border bg-background aspect-[16/10] sm:aspect-[16/9] flex flex-col">
            {/* Toolbar mockup */}
            <div className="h-12 border-b border-border bg-muted/30 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                <div className="w-3 h-3 rounded-full bg-green-400/50" />
              </div>
              <div className="flex items-center gap-4 bg-background border border-border rounded-md px-3 py-1 text-xs text-muted-foreground font-medium w-1/3">
                <Search aria-hidden="true" className="w-3 h-3" />
                <span>Search in document…</span>
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
                  <FileText aria-hidden="true" className="w-3 h-3" /> Source
                  Page
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
                  <Sparkles aria-hidden="true" className="w-3 h-3" /> Extracted
                  Arabic
                </div>
                <div className="flex-1 font-arabic text-right text-xl leading-relaxed text-foreground">
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
                  <Languages aria-hidden="true" className="w-3 h-3" />{" "}
                  Translation Draft
                </div>
                <div className="flex-1 font-sans text-sm leading-relaxed text-foreground/80 space-y-3">
                  <div className="p-2 rounded bg-accent/5 border-l-2 border-accent mb-2">
                    <p className="font-semibold text-accent text-[10px] uppercase mb-1">
                      AI Suggestion
                    </p>
                    <p>
                      In the name of Allah, the Most Gracious, the Most
                      Merciful.
                    </p>
                  </div>
                  <p>All praise is due to Allah, Lord of all the worlds.</p>
                  <p>The Entirely Merciful, the Especially Merciful.</p>
                  <p>Sovereign of the Day of Recompense.</p>
                  <p>It is You we worship and You we ask for help…</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Glow effects */}
          <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-primary/10 rounded-full blur-[88px] pointer-events-none" />
          <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-accent/10 rounded-full blur-[88px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
