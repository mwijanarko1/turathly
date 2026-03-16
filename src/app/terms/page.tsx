import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Turathly — context-aware translation for Islamic texts.",
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main id="main-content">
      <Navbar />
      <article className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last updated: March 16, 2025
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By creating an account or using Turathly (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service. We reserve the right to update these Terms at any time; continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                2. Description of Service
              </h2>
              <p className="leading-relaxed">
                Turathly provides a translation workspace for Islamic texts, including document upload, OCR extraction, and AI-assisted translation. The Service is offered on a subscription or free-tier basis as described on our{" "}
                <Link href="/pricing" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  Pricing
                </Link>{" "}
                page.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                3. Account and Eligibility
              </h2>
              <p className="leading-relaxed">
                You must be at least 13 years of age to use the Service. If you are under 18, you must have parental or guardian consent. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                4. Acceptable Use
              </h2>
              <p className="leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Use the Service for any illegal purpose or in violation of applicable laws</li>
                <li>Upload content that infringes intellectual property rights or violates others&apos; privacy</li>
                <li>Attempt to gain unauthorized access to the Service, other accounts, or our systems</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Use automated means to scrape, crawl, or extract data without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                5. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                Turathly and its licensors retain all rights to the Service, including software, design, and branding. You retain ownership of content you upload. By uploading content, you grant us a limited license to process, store, and display it solely to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                6. Pricing and Payment
              </h2>
              <p className="leading-relaxed">
                Paid plans are billed according to the pricing displayed at checkout. Prices are in the currency shown and exclude applicable taxes unless stated otherwise. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                7. Refund Policy
              </h2>
              <p className="leading-relaxed">
                If you are unsatisfied with a paid subscription, contact us within 14 days of your initial purchase for a full refund. Refunds are not available for renewals or partial billing periods. See our{" "}
                <Link href="/pricing" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  Pricing
                </Link>{" "}
                page for details.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                8. Disclaimer of Warranties
              </h2>
              <p className="leading-relaxed">
                The Service is provided &quot;as is&quot; and &quot;as available.&quot; We do not warrant that the Service will be uninterrupted, error-free, or that translations or OCR results will be accurate. Use the Service at your own risk.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                9. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, Turathly shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                10. Termination
              </h2>
              <p className="leading-relaxed">
                We may suspend or terminate your account if you breach these Terms. You may delete your account at any time. Upon termination, your right to use the Service ceases immediately. We may retain certain data as required by law or for legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                11. Governing Law
              </h2>
              <p className="leading-relaxed">
                These Terms are governed by the laws of the jurisdiction in which Turathly operates. Any disputes shall be resolved in the courts of that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                12. Contact
              </h2>
              <p className="leading-relaxed">
                For questions about these Terms, contact us at{" "}
                <a href="mailto:mikhailspeaks@gmail.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  mikhailspeaks@gmail.com
                </a>
                . Our legal entity and address are available in our{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
