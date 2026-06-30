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
import { getImagesBySection, getCategories, getSubcategories, getFaqs } from "@/lib/data";

export default function HomePage() {
  const heroImages = getImagesBySection("hero");
  const portfolioImages = getImagesBySection("home-portfolio");
  const categories = getCategories();
  const subcategories = getSubcategories();
  const faqs = getFaqs();

  return (
    <>
      <Navbar />
      <main>
        <HomeHero heroImages={heroImages} />
        <HomeStats />
        <HomeProducts categories={categories} subcategories={subcategories} />
        <HomePortfolioPreview images={portfolioImages} />
        <HomePartners />
        <HomeCTA />
        <HomeFAQ items={faqs} />
      </main>
      <Footer />
    </>
  );
}
