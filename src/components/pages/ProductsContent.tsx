"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import type { Category, Subcategory, SiteImage } from "@/types";
import { ZoomIn, X, Box } from "lucide-react";
import Link from "next/link";
import ModelViewer from "@/components/ModelViewer";

interface Props {
  categories: Category[];
  subcategories: Subcategory[];
  images: SiteImage[];
}

const catBg: Record<string, string> = {
  tenda: "from-[#1a1a1a] to-[#2d2d2d]",
  cadra: "from-[#c0231e] to-[#9a1c18]",
};

export default function ProductsContent({ categories, subcategories, images }: Props) {
  const { lang, t } = useLang();
  const p = t.products_page;
  const [lightbox, setLightbox] = useState<SiteImage | null>(null);
  const [model3d, setModel3d] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{p.label}</p>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">{p.title}</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{p.subtitle}</p>
        </div>
      </section>

      <div className="bg-[#1a1a1a] h-12 relative">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#faf8f4]" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </div>

      {/* Category sections */}
      <div className="bg-[#faf8f4]">
        {categories.map((cat, catIdx) => {
          const catSubs = subcategories.filter((s) => s.categoryId === cat.id).sort((a, b) => a.order - b.order);
          const bg = catBg[cat.id] ?? (catIdx % 2 === 0 ? "from-[#1a1a1a] to-[#2d2d2d]" : "from-[#2d2d2d] to-[#444]");

          return (
            <section key={cat.id} id={cat.id} className={catIdx % 2 === 0 ? "bg-[#faf8f4] py-20" : "bg-white py-20"}>
              <div className="max-w-7xl mx-auto px-6">
                {/* Category header */}
                <div className="flex items-center gap-4 mb-12">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center text-3xl shrink-0 overflow-hidden`}>
                    {cat.coverImage ? (
                      <>
                        <Image src={cat.coverImage} alt={lang === "sq" ? cat.name_sq : cat.name_en} fill className="object-cover" style={{ objectPosition: cat.coverPosition ?? "50% 50%" }} />
                        <div className={`absolute inset-0 bg-gradient-to-br ${bg} opacity-60`} />
                        <span className="relative">{cat.icon}</span>
                      </>
                    ) : cat.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">
                      {lang === "sq" ? cat.name_sq : cat.name_en}
                    </h2>
                    <p className="text-[#2d2d2d]/50 text-sm mt-0.5">
                      {catSubs.length} {catSubs.length === 1 ? "subcategory" : "subcategories"}
                    </p>
                  </div>
                </div>

                {catSubs.length === 0 ? (
                  <div className="py-12 text-center text-[#2d2d2d]/40 text-sm">
                    No subcategories yet. Add them from the admin panel.
                  </div>
                ) : (
                  <div className="space-y-14">
                    {catSubs.map((sub) => {
                      const subImages = images.filter((img) => img.section === sub.id).sort((a, b) => a.order - b.order);
                      return (
                        <div key={sub.id} id={sub.id}>
                          {/* Subcategory header */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 rounded-full bg-[#c0231e]" />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="font-display text-2xl font-semibold text-[#1a1a1a]">
                                  {lang === "sq" ? sub.name_sq : sub.name_en}
                                </h3>
                                {sub.modelUrl && (
                                  <button
                                    onClick={() => setModel3d({ src: sub.modelUrl!, alt: lang === "sq" ? sub.name_sq : sub.name_en })}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#c0231e] transition-colors"
                                  >
                                    <Box size={13} /> {lang === "sq" ? "Shiko 3D" : "View 3D"}
                                  </button>
                                )}
                              </div>
                              {(lang === "sq" ? sub.desc_sq : sub.desc_en) && (
                                <p className="text-[#2d2d2d]/60 text-sm mt-0.5">
                                  {lang === "sq" ? sub.desc_sq : sub.desc_en}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Photos or placeholder */}
                          {subImages.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {subImages.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer bg-gray-100"
                                  onClick={() => setLightbox(img)}>
                                  <Image src={img.url} alt={img.title || img.originalName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/50 transition-all flex items-center justify-center">
                                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                                  </div>
                                  {img.title && (
                                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <p className="text-white text-xs font-medium truncate">{img.title}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className={`h-40 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center opacity-40`}>
                              <p className="text-white text-sm">No photos yet</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="bg-[#faf8f4] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-3xl p-12">
            <h3 className="font-display text-3xl font-bold text-white mb-4">{p.cta_title}</h3>
            <p className="text-white/60 mb-8">{p.cta_desc}</p>
            <Link href="/contact" className="inline-block px-8 py-4 bg-[#c0231e] text-white font-semibold rounded-full hover:bg-[#9a1c18] active:bg-[#9a1c18] transition-colors touch-manipulation">
              {p.cta_btn}
            </Link>
          </div>
        </div>
      </section>


      {/* 3D Model Viewer */}
      {model3d && (
        <ModelViewer
          src={model3d.src}
          alt={model3d.alt}
          onClose={() => setModel3d(null)}
        />
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-[#c0231e] transition-colors z-10" onClick={() => setLightbox(null)}>
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox.url} alt={lightbox.title || lightbox.originalName} width={1200} height={800}
              className="max-h-[85vh] w-auto object-contain rounded-xl" />
            {lightbox.title && (
              <div className="mt-3 text-center">
                <p className="text-white font-semibold">{lightbox.title}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
