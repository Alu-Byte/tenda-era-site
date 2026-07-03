export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsContent from "@/components/pages/ProductsContent";
import { readDataAsync } from "@/lib/data";

export default async function ProductsPage() {
  const data = await readDataAsync();
  const categories = [...data.categories].sort((a, b) => a.order - b.order);
  const subcategories = [...data.subcategories].sort((a, b) => a.order - b.order);
  const visibleImages = data.images.filter((img) => img.visible);

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
