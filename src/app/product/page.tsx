import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Sparkles,
  Languages,
  BookOpen,
  Search,
  History,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com";

export const metadata = {
  title: "Product",
  description:
    "A translation workspace for Islamic texts: upload manuscripts, OCR Arabic, and translate with context-aware AI.",
  alternates: {
    canonical: `${baseUrl}/product`,
  },
  openGraph: {
    title: "Product | Turathly — Context-aware translation for Islamic texts",
    description:
      "Upload manuscripts, OCR Arabic, and translate with context-aware AI. Built for serious scholarship.",
    url: `${baseUrl}/product`,
  },
};

export default function ProductPage() {
  return (
    <main id="main-content">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            Built for serious scholarship.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Beyond translation—a workspace that understands the depth of Islamic
            literature. Upload, extract, and translate with context-aware AI.
          </p>
        </div>
      </section>

      <section className="py-20 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-16 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-border/20">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3 tracking-tight">
                Upload classical manuscripts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                PDFs, scanned pages, or images. Our preprocessing engine cleans
                and prepares documents for extraction—whether it’s a printed book
                or a handwritten manuscript.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 ring-1 ring-border/20">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3 tracking-tight">
                Next-gen Arabic OCR
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Neural OCR trained on classical typography. Extracts text with
                page coordinates and correct reading order for multi-column texts
                and marginalia.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 ring-1 ring-border/20">
                <Languages className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3 tracking-tight">
                Scholarship-first translation
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Context-aware drafts, not literal word swaps. Handles Qur’anic
                references, scholarly terminology, and learns from your edits.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-12 text-center tracking-tight">
            More tools for the desk
          </h2>
          <div className="grid gap-10 md:grid-cols-3 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Lexicon search
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hans Wehr and Lisan al-Arab inside the workspace.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mx-auto">
                <History className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Translation memory
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reuse how you translated similar phrases across projects.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mx-auto">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Multi-language
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                English, Indonesian, Urdu, and French target languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border bg-muted/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
            A digital research tool, not a productivity dashboard.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Turathly is designed to feel like a translation desk: soft
            backgrounds, clear typography, and a three-column workspace that
            keeps source, Arabic text, and your translation in view.
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 font-medium"
            >
              Start translating
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
