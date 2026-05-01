import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioContent from "@/components/pages/PortfolioContent";
import { getImagesBySection } from "@/lib/data";

export default async function PortfolioPage() {
  const images = getImagesBySection("portfolio");
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
