import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com";

export const metadata = {
  title: "Pricing",
  description:
    "Plans for students, translators, and institutes. Page-based pricing for serious Islamic text translation.",
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
  openGraph: {
    title: "Pricing | Turathly — Plans for Islamic text translation",
    description:
      "Student, Translator, Professional, and Institute plans. Page-based pricing for serious scholarship.",
    url: `${baseUrl}/pricing`,
  },
};

const plans = [
  {
    name: "Student",
    price: "$12",
    period: "/ month",
    description: "For students and occasional translation.",
    features: [
      "2 projects",
      "200 pages per month",
      "Basic AI translation",
    ],
    cta: "Get started",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Translator",
    price: "$29",
    period: "/ month",
    description: "For active translators and small teams.",
    features: [
      "20 projects",
      "1,000 pages per month",
      "Glossary system",
      "Translation memory",
      "Export tools",
    ],
    cta: "Get started",
    href: "/sign-up",
    highlighted: true,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/ month",
    description: "For full-time translators and research.",
    features: [
      "Unlimited projects",
      "5,000 pages per month",
      "Priority OCR processing",
      "Advanced AI translation",
      "Team sharing",
    ],
    cta: "Get started",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Institute",
    price: "Custom",
    period: "",
    description: "For institutes and large teams.",
    features: [
      "Team workspace",
      "Shared glossary",
      "API access",
      "Private models",
    ],
    cta: "Contact sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main id="main-content">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            Pricing that scales with your work
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Page-based pricing fits how Islamic translators work—by the book.
          </p>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col ${
                  plan.highlighted
                    ? "ring-2 ring-primary shadow-lg border-primary/30"
                    : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-heading text-2xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-4">
                  <Link href={plan.href} className="w-full">
                    <Button
                      className="w-full rounded-full font-medium"
                      variant={plan.highlighted ? "default" : "outline"}
                      size="sm"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border bg-muted/20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-muted-foreground leading-relaxed">
            Limits are based on pages processed per month. Need more? Contact us
            for custom volume or institute licensing.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
