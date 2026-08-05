export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import HomeStats from "@/components/home/HomeStats";
import HomeProducts from "@/components/home/HomeProducts";
import HomePortfolioPreview from "@/components/home/HomePortfolioPreview";
import HomePartners from "@/components/home/HomePartners";
import HomeCTA from "@/components/home/HomeCTA";
import HomeFAQ from "@/components/home/HomeFAQ";
import { readDataAsync } from "@/lib/data";

export default async function HomePage() {
  const data = await readDataAsync();
  const heroImages = data.images.filter((i) => i.section === "hero" && i.visible).sort((a, b) => a.order - b.order);
  const portfolioImages = data.images.filter((i) => i.section === "portfolio" && i.visible).sort((a, b) => a.order - b.order);
  const categories = [...data.categories].sort((a, b) => a.order - b.order);
  const subcategories = [...data.subcategories].sort((a, b) => a.order - b.order);
  const faqs = [...data.faqs].sort((a, b) => a.order - b.order);

  return (
    <>
      <Navbar />
      <main>
        <HomeHero heroImages={heroImages} />
        <HomePartners />
        <HomeProducts categories={categories} subcategories={subcategories} />
        <HomePortfolioPreview images={portfolioImages} />
        <HomeStats />
        <HomeCTA />
        <HomeFAQ items={faqs} />
      </main>
      <Footer />
    </>
  );
}
