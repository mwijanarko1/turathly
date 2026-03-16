import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Turathly — how we collect, use, and protect your data.",
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <Navbar />
      <article className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last updated: March 16, 2025
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                1. Who We Are
              </h2>
              <p className="leading-relaxed">
                Turathly (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Turathly translation workspace. For data protection inquiries, contact us at{" "}
                <a href="mailto:mikhailspeaks@gmail.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  mikhailspeaks@gmail.com
                </a>
                . Our legal entity and registered address will be provided upon request or in your jurisdiction-specific notice.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                2. Data We Collect
              </h2>
              <p className="leading-relaxed mb-4">
                We collect the following categories of data:
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li><strong className="text-foreground">Account data:</strong> Email, name, and authentication credentials (handled by Clerk). We store a reference to your identity in our database.</li>
                <li><strong className="text-foreground">Content you upload:</strong> Documents, images, and text you add to projects for OCR and translation.</li>
                <li><strong className="text-foreground">Usage data:</strong> Logs of actions (e.g., project creation, translations) to operate and improve the Service.</li>
                <li><strong className="text-foreground">Technical data:</strong> IP address, browser type, and device information for security and analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                3. How We Use Your Data
              </h2>
              <p className="leading-relaxed">
                We use your data to provide the Service (OCR, translation, project management), authenticate you, improve our product, comply with legal obligations, and communicate with you about your account. We do not sell your personal data.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                4. Legal Basis (GDPR)
              </h2>
              <p className="leading-relaxed">
                If you are in the European Economic Area (EEA) or UK, we process your data based on: (a) contract performance (providing the Service), (b) legitimate interests (security, analytics, product improvement), (c) consent where required (e.g., marketing), and (d) legal obligation.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                5. Your Rights
              </h2>
              <p className="leading-relaxed mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data.</li>
                <li><strong className="text-foreground">Rectification:</strong> Correct inaccurate data.</li>
                <li><strong className="text-foreground">Erasure:</strong> Request deletion of your data.</li>
                <li><strong className="text-foreground">Portability:</strong> Receive your data in a machine-readable format.</li>
                <li><strong className="text-foreground">Object or restrict:</strong> Object to processing or request restriction in certain cases.</li>
                <li><strong className="text-foreground">Withdraw consent:</strong> Where processing is based on consent.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise these rights, contact{" "}
                <a href="mailto:mikhailspeaks@gmail.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  mikhailspeaks@gmail.com
                </a>
                . You may also lodge a complaint with your local data protection authority.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                6. California (CCPA) Rights
              </h2>
              <p className="leading-relaxed">
                California residents have the right to know what personal information we collect, to delete it, to opt out of &quot;sale&quot; or &quot;sharing,&quot; and to non-discrimination. We do not sell or share your personal information for cross-context behavioral advertising. To exercise your rights, contact{" "}
                <a href="mailto:mikhailspeaks@gmail.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  mikhailspeaks@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                7. Children
              </h2>
              <p className="leading-relaxed">
                The Service is not intended for users under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such data, contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                8. Cookies and Tracking
              </h2>
              <p className="leading-relaxed">
                We use necessary cookies for authentication and session management. We may use analytics cookies to understand usage. You can control non-essential cookies through your browser settings or our cookie preferences when available. See our cookie policy for details.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                9. Data Retention
              </h2>
              <p className="leading-relaxed">
                We retain your data for as long as your account is active and as needed to provide the Service. After account deletion, we may retain certain data for legal, security, or legitimate business purposes as permitted by law.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                10. Security
              </h2>
              <p className="leading-relaxed">
                We use industry-standard measures to protect your data, including encryption in transit and at rest, access controls, and secure authentication. Sensitive data such as authentication credentials are handled by trusted providers (e.g., Clerk).
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                11. International Transfers
              </h2>
              <p className="leading-relaxed">
                Your data may be processed in countries outside your residence. We ensure appropriate safeguards (e.g., Standard Contractual Clauses) when transferring data from the EEA or UK.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                12. Changes
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes via email or a notice in the Service. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                13. Contact
              </h2>
              <p className="leading-relaxed">
                For privacy questions or to exercise your rights, contact us at{" "}
                <a href="mailto:mikhailspeaks@gmail.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  mikhailspeaks@gmail.com
                </a>
                . Our{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                govern your use of the Service.
              </p>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
