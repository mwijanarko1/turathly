import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Fraunces } from "next/font/google";
import { Noto_Naskh_Arabic } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/lib/providers";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#5A4B81",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Turathly — Context-aware translation for Islamic texts",
    template: "%s | Turathly",
  },
  description: "A translation workspace designed for scholars working with classical Islamic books. Upload PDFs, OCR Arabic text, and translate with AI assistance.",
  keywords: ["Islamic texts", "Arabic translation", "OCR", "AI translation", "classical Arabic", "Islamic scholarship"],
  authors: [{ name: "Turathly" }],
  creator: "Turathly",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com",
  },
  openGraph: {
    title: "Turathly — Context-aware translation for Islamic texts",
    description: "A translation workspace designed for scholars working with classical Islamic books.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://turathly.com",
    siteName: "Turathly",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Turathly - Islamic Text Translation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turathly — Context-aware translation for Islamic texts",
    description: "A translation workspace designed for scholars working with classical Islamic books.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSans.variable} ${fraunces.variable} ${notoNaskhArabic.variable} antialiased bg-background text-foreground`}
      >
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          afterSignOutUrl="/"
          dynamic
        >
          <ConvexClientProvider>
            <a
              href="#main-content"
              className="absolute -top-12 left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-[top] duration-200 focus:top-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Skip to main content
            </a>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
