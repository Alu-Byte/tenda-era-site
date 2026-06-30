export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "@/components/pages/AboutContent";
import { getImagesBySection } from "@/lib/data";

export default function AboutPage() {
  const aboutImages = getImagesBySection("about");
  return (
    <>
      <Navbar />
      <main><AboutContent images={aboutImages} /></main>
      <Footer />
    </>
  );
}
