export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioContent from "@/components/pages/PortfolioContent";
import { readDataAsync } from "@/lib/data";

export default async function PortfolioPage() {
  const data = await readDataAsync();
  const images = data.images
    .filter((img) => img.section === "portfolio" && img.visible)
    .sort((a, b) => a.order - b.order);
  return (
    <>
      <Navbar />
      <main>
        <PortfolioContent images={images} />
      </main>
      <Footer />
    </>
  );
}
