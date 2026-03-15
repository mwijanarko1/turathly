import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  BookMarked,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com";

export const metadata = {
  title: "Resources",
  description:
    "Documentation, guides, and support for translating Islamic texts with Turathly.",
  alternates: {
    canonical: `${baseUrl}/resources`,
  },
  openGraph: {
    title: "Resources | Turathly — Documentation and guides",
    description:
      "Documentation, guides, and support for translating Islamic texts with Turathly.",
    url: `${baseUrl}/resources`,
  },
};

const resourceGroups = [
  {
    title: "Documentation",
    description: "Technical reference for the workspace and API.",
    items: [
      { label: "Getting started", href: "#", icon: BookOpen },
      { label: "Upload & OCR", href: "#", icon: FileText },
      { label: "Translation workspace", href: "#", icon: BookMarked },
      { label: "Glossary & memory", href: "#", icon: BookMarked },
    ],
  },
  {
    title: "Guides",
    description: "Step-by-step guides for common workflows.",
    items: [
      { label: "Your first project", href: "#", icon: FileText },
      { label: "Best practices for classical texts", href: "#", icon: BookOpen },
      { label: "Exporting and publishing", href: "#", icon: FileText },
    ],
  },
  {
    title: "Support",
    description: "Get help and stay updated.",
    items: [
      { label: "Help center", href: "#", icon: MessageCircle },
      { label: "Contact support", href: "/contact", icon: MessageCircle },
      { label: "Blog", href: "#", icon: BookOpen },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main id="main-content">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            Resources
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Documentation, guides, and support for translating Islamic texts
            with Turathly.
          </p>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-16 md:grid-cols-3">
            {resourceGroups.map((group) => (
              <div key={group.title} className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 tracking-tight">
                    {group.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {group.description}
                  </p>
                </div>
                <ul className="space-y-4">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:bg-muted/30 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-primary shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border bg-muted/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-muted-foreground leading-relaxed mb-6">
            New to Turathly? Start with the getting started guide, then explore
            the translation workspace docs.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
          >
            Create an account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
