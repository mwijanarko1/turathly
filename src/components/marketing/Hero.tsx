"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Languages,
  Search,
  FileText,
} from "lucide-react";

const ARABIC_SAMPLE = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
يَقُولُ عَبْدُ الْوَاحِدِ بْنُ عَاشِرٍ مُبْتَدِئًا بِاسْمِ الْإِلَهِ الْقَادِرِ
الْحَمْدُ لِلَّهِ الَّذِي عَلَّمَنَا مِنَ الْعُلُومِ مَا بِهِ كَلَّفَنَا
صَلَّى وَسَلَّمَ عَلَى مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ وَالْمُقْتَدِي
وَبَعْدُ فَالْعَوْنُ مِنَ اللَّهِ الْمَجِيدِ فِي نَظْمِ أَبْيَاتٍ لِلْأُمِّيِّ تُفِيدُ
فِي عَقْدِ الْأَشْعَرِيِّ وَفِقْهِ مَالِكٍ وَفِي طَرِيقَةِ الْجُنَيْدِ السَّالِكِ مُقَدِّمَةً لِكِتَابِ الْاِعْتِقَادِ مُعَيِّنَةً لِقَارِيهَا عَلَى الْمُرَادِ
وَحُكْمُنَا الْعَقْلِيُّ قَضِيَّةٌ بِلَا وَقْفٍ عَلَى عَادَةٍ أَوْ وَضْعِ جَلَا
أَقْسَامُ مُقْتَضَاهُ بِالْحَصْرِ تَمَازَ وَهِيَ الْوُجُوبُ الْاِسْتِحَالَةُ الْجَوَازُ
فَوَاجِبٌ لَا يَقْبَلُ النَّفْيَ مُحَالُ وَمَا أَبَى الثُّبُوتَ عُقْلَاءُ الْمَحَالِ
وَجَائِزًا مَا قَبِلَ الْأَمْرَيْنِ سَمْ لِلضَّرَرِيِّ وَالنَّظَرِيِّ كُلَّ قِسْمِ`;

const TRANSLATION_SAMPLE = `In the name of Allah, the Most Gracious, the Most Merciful.

Abdul Wahid bin Ashir says, beginning with the name of God, the All-Powerful.

All praise is due to Allah, who taught us from the sciences what He commanded us.

May peace and blessings be upon Muhammad, his family, his companions, and his followers.

And thereafter, assistance comes from Allah, the Most Glorious, in composing verses that benefit the illiterate.

This is in the doctrine of Ash'ari and the jurisprudence of Malik, and in the path of Junayd, the traveler. It is a preface to the book of belief, helping its reader towards the intended meaning.

Our rational judgment is a matter without dependence on custom or a clear convention.

Its requirements are divided into three parts exclusively: obligation, impossibility, and permissibility.

What is obligatory cannot be denied. What is impossible is what the wise deem impossible to prove.

And permissible is what accepts both matters. Name each division: the necessary and the theoretical.`;

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-accent/30 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [arabicText, setArabicText] = useState(ARABIC_SAMPLE);
  const [translationText, setTranslationText] = useState(TRANSLATION_SAMPLE);

  const arabicHighlighted = useMemo(
    () => highlightMatch(arabicText, searchQuery),
    [arabicText, searchQuery]
  );
  const translationHighlighted = useMemo(
    () => highlightMatch(translationText, searchQuery),
    [translationText, searchQuery]
  );
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
              <label className="flex flex-1 max-w-xs items-center gap-2 bg-background border border-border rounded-md px-3 py-2 text-xs font-medium w-1/3 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-colors">
                <Search aria-hidden="true" className="w-3 h-3 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in document…"
                  className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                  aria-label="Search in document"
                />
              </label>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20" />
                <div className="w-8 h-8 rounded bg-secondary/10 border border-secondary/20" />
              </div>
            </div>

            {/* Content Mockup */}
            <div className="flex-1 grid grid-cols-3 divide-x divide-border">
              {/* Column 1: Source PDF (matches workspace PdfViewer) */}
              <div className="p-4 flex flex-col gap-4 overflow-hidden relative">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
                  <FileText aria-hidden="true" className="w-3 h-3" /> Source
                  PDF
                </div>
                <div className="flex-1 min-h-0 rounded border border-border bg-muted/10 overflow-hidden">
                  <img
                    src="/hero-pdf.png"
                    alt="Example Arabic document page with Basmala and classical text"
                    className="w-full h-full object-contain object-top"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
              </div>

              {/* Column 2: Arabic Source (matches workspace column label) */}
              <div className="p-4 flex flex-col gap-4 overflow-hidden relative bg-muted/5">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Sparkles aria-hidden="true" className="w-3 h-3" /> Arabic
                  Source
                </div>
                <div className="flex-1 min-h-0">
                  {searchQuery.trim() ? (
                    <div
                      className="font-arabic text-right text-xl leading-relaxed text-foreground overflow-y-auto h-full whitespace-pre-wrap"
                      dir="rtl"
                    >
                      {arabicHighlighted}
                    </div>
                  ) : (
                    <textarea
                      value={arabicText}
                      onChange={(e) => setArabicText(e.target.value)}
                      dir="rtl"
                      className="font-arabic w-full h-full min-h-[120px] text-right text-xl leading-relaxed text-foreground bg-transparent border-0 resize-none overflow-hidden focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"
                      placeholder="Arabic source text…"
                      aria-label="Arabic source text"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
              </div>

              {/* Column 3: Translation Editor (matches workspace column label) */}
              <div className="p-4 flex flex-col gap-4 overflow-hidden relative">
                <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Languages aria-hidden="true" className="w-3 h-3" />{" "}
                  Translation Editor
                </div>
                <div className="flex-1 min-h-0">
                  {searchQuery.trim() ? (
                    <div className="font-sans text-sm leading-relaxed text-foreground/80 overflow-y-auto h-full whitespace-pre-wrap">
                      {translationHighlighted}
                    </div>
                  ) : (
                    <textarea
                      value={translationText}
                      onChange={(e) => setTranslationText(e.target.value)}
                      className="font-sans w-full h-full min-h-[120px] text-sm leading-relaxed text-foreground/80 bg-transparent border-0 resize-none overflow-hidden focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"
                      placeholder="Enter translation…"
                      aria-label="Translation"
                    />
                  )}
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
