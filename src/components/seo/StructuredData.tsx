const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Turathly",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description:
    "Context-aware translation for Islamic texts. A translation workspace designed for scholars working with classical Islamic books.",
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Turathly",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "A translation workspace for Islamic texts. Upload PDFs, OCR Arabic text, and translate with context-aware AI assistance. Built for scholars, translators, and institutes.",
  url: baseUrl,
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "12",
    highPrice: "79",
    priceCurrency: "USD",
    offerCount: 4,
  },
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
    </>
  );
}
