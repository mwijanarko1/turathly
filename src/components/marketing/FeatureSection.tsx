import Link from "next/link";
import {
  FileText,
  Languages,
  Sparkles,
  Search,
  History,
  GraduationCap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Upload Classical Manuscripts",
    description:
      "Whether it's a scanned PDF, a handwritten manuscript image, or a modern digital book, Turathly handles it. Our preprocessing engine ensures documents are cleaned and ready for extraction.",
    image: (
      <div className="relative w-full h-full p-4 flex flex-col gap-4 overflow-hidden group">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="rounded-xl border border-border bg-muted/20 p-4 aspect-[4/5] flex items-center justify-center relative shadow-sm">
            <FileText className="w-16 h-16 text-primary/30" />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              PDF
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/10 p-4 aspect-[4/5] flex items-center justify-center relative shadow-sm translate-y-8">
            <FileText className="w-16 h-16 text-secondary/30" />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">
              IMAGE
            </div>
          </div>
        </div>
      </div>
    ),
    accent: "bg-primary/5 text-primary",
  },
  {
    icon: Sparkles,
    title: "Arabic OCR with Layout Fidelity",
    description:
      "Trained on classical Arabic typography, Turathly extracts text with precise page coordinates and preserves the reading order of multi-column texts, glosses, and marginal notes.",
    image: (
      <div className="relative w-full h-full p-6 flex flex-col gap-4 overflow-hidden group">
        <div className="rounded-xl border border-border bg-background p-4 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
              OCR Pipeline
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div className="font-arabic text-xl leading-relaxed text-right text-foreground">
            <span className="bg-primary/10 border-b-2 border-primary/40 px-1 rounded-sm">
              فَإِنَّ
            </span>{" "}
            مَعَ الْعُسْرِ يُسْرًا
            <br />
            إِنَّ مَعَ{" "}
            <span className="bg-accent/10 border-b-2 border-accent/40 px-1 rounded-sm">
              الْعُسْرِ
            </span>{" "}
            يُسْرًا
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-6 px-3 rounded-full bg-muted flex items-center gap-1.5 border border-border text-[10px] font-medium tabular-nums">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
              Confidence: 98.7%
            </div>
            <div className="h-6 px-3 rounded-full bg-muted flex items-center gap-1.5 text-[10px] font-medium border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" /> Script:
              Naskh
            </div>
          </div>
        </div>
      </div>
    ),
    accent: "bg-accent/5 text-accent",
    reverse: true,
  },
  {
    icon: Languages,
    title: "Scholarship-First Translation",
    description:
      "Our AI understands the difference between literal and context-aware translation. It respects scholarly terminology, handles Qur'anic references automatically, and learns from your editing style.",
    image: (
      <div className="relative w-full h-full p-6 flex flex-col gap-4 overflow-hidden group">
        <div className="rounded-xl border border-border bg-background p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Scholarly Engine
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Active learning
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-lg border border-border bg-muted/20 relative">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">
                Literal
              </p>
              <p className="text-sm italic text-muted-foreground line-through decoration-destructive/50 font-serif">
                "blocking the means"
              </p>
            </div>
            <div className="p-3 rounded-lg border border-accent/20 bg-accent/5 relative shadow-sm ring-1 ring-accent/10">
              <p className="text-[10px] font-bold text-accent uppercase mb-2">
                Context-Aware
              </p>
              <p className="text-sm font-semibold text-foreground font-serif leading-relaxed">
                "preventing actions that lead to harm"
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    accent: "bg-secondary/5 text-secondary",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-32">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Built for serious scholarship.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Beyond translation—a workspace that understands the depth of Islamic
            literature.
          </p>
        </div>

        <div className="space-y-40">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className={`flex flex-col ${feature.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16 lg:gap-24`}
              >
                <div className="flex-1 space-y-8 text-center lg:text-left">
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.accent} flex items-center justify-center mb-6 shadow-sm mx-auto lg:mx-0 ring-1 ring-border/20`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-muted-foreground leading-relaxed font-light">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <Link
                      href="/resources"
                      className="inline-flex h-8 items-center justify-center rounded-full border border-primary/20 px-6 text-sm font-semibold text-foreground transition-[background-color,border-color,color,box-shadow,transform] hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      Explore guides
                    </Link>
                  </div>
                </div>

                <div className="flex-1 w-full max-w-xl aspect-square rounded-3xl bg-muted/30 border border-border relative overflow-hidden group shadow-inner">
                  {feature.image}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust bar / Additional Features */}
      <div className="mt-40 border-t border-border bg-muted/10 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center mx-auto mb-6">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-heading text-xl font-bold">Lexicon Search</h4>
            <p className="text-muted-foreground font-light text-sm">
              Instant access to Hans Wehr and Lisan al-Arab within the
              workspace.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center mx-auto mb-6">
              <History className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="font-heading text-xl font-bold">
              Translation Memory
            </h4>
            <p className="text-muted-foreground font-light text-sm">
              Turathly remembers how you translated similar phrases across your
              projects.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center mx-auto mb-6">
              <Languages className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-heading text-xl font-bold">Multilingual</h4>
            <p className="text-muted-foreground font-light text-sm">
              Full support for English, Indonesian, Urdu, and French target
              languages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
