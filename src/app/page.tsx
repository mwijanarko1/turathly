import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { FeatureSection } from "@/components/marketing/FeatureSection";
import { Footer } from "@/components/marketing/Footer";
import { StructuredData } from "@/components/seo/StructuredData";

export default function HomePage() {
  return (
    <main id="main-content">
      <StructuredData />
      <Navbar />
      <Hero />
      <FeatureSection />
      <Footer />
    </main>
  );
}