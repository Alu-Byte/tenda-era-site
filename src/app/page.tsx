export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import HomeStats from "@/components/home/HomeStats";
import HomeProducts from "@/components/home/HomeProducts";
import HomePortfolioPreview from "@/components/home/HomePortfolioPreview";
import HomePartners from "@/components/home/HomePartners";
import HomeCTA from "@/components/home/HomeCTA";
import { getImagesBySection, getCategories, getSubcategories } from "@/lib/data";

export default function HomePage() {
  const heroImages = getImagesBySection("hero");
  const categories = getCategories();
  const subcategories = getSubcategories();

  return (
    <>
      <Navbar />
      <main>
        <HomeHero heroImages={heroImages} />
        <HomeStats />
        <HomeProducts categories={categories} subcategories={subcategories} />
        <HomePortfolioPreview />
        <HomePartners />
        <HomeCTA />
      </main>
      <Footer />
    </>
  );
}
