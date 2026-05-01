export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsContent from "@/components/pages/ProductsContent";
import { getCategories, getSubcategories, readData } from "@/lib/data";

export default function ProductsPage() {
  const categories = getCategories();
  const subcategories = getSubcategories();
  // Fetch all images once; ProductsContent will filter per subcategory
  const { images } = readData();
  const visibleImages = images.filter((img) => img.visible);

  return (
    <>
      <Navbar />
      <main>
        <ProductsContent
          categories={categories}
          subcategories={subcategories}
          images={visibleImages}
        />
      </main>
      <Footer />
    </>
  );
}
