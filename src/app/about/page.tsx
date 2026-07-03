export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "@/components/pages/AboutContent";
import { readDataAsync } from "@/lib/data";

export default async function AboutPage() {
  const data = await readDataAsync();
  const aboutImages = data.images
    .filter((img) => img.section === "about" && img.visible)
    .sort((a, b) => a.order - b.order);
  return (
    <>
      <Navbar />
      <main><AboutContent images={aboutImages} /></main>
      <Footer />
    </>
  );
}
