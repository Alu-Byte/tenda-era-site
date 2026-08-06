"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Box, ArrowUpRight, Phone } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { Category, Subcategory, SiteImage } from "@/types";
import ModelViewer from "@/components/ModelViewer";

interface Props {
  categories: Category[];
  subcategories: Subcategory[];
  images: SiteImage[];
}

export default function ProductsContent({ categories, subcategories, images }: Props) {
  const { lang, t } = useLang();
  const p = t.products_page;
  const [lightbox, setLightbox] = useState<SiteImage | null>(null);
  const [model3d, setModel3d] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      {/* ── Page header ─────────────────────────────────────── */}
      <section className="bg-[#faf7f2] pt-32 pb-14 lg:pt-40 lg:pb-20 px-6 border-b border-[#e3ddd1]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dc2626] mb-3">
                — {p.label}
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1c1917] leading-[1.05] tracking-tight">
                {p.title}
              </h1>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-[#57534e] text-base lg:text-lg leading-relaxed">{p.subtitle}</p>
            </div>
          </div>

          {/* Quick category jump — anchor-links to sections below */}
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e3ddd1] rounded-full text-sm font-semibold text-[#1c1917] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors no-underline"
              >
                {lang === "sq" ? cat.name_sq : cat.name_en}
                <span className="text-xs text-[#57534e]">
                  {subcategories.filter((s) => s.categoryId === cat.id).length}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category sections ───────────────────────────────── */}
      {categories.map((cat, catIdx) => {
        const catSubs = subcategories.filter((s) => s.categoryId === cat.id).sort((a, b) => a.order - b.order);
        const sectionBg = catIdx % 2 === 0 ? "bg-[#faf7f2]" : "bg-white";

        return (
          <section key={cat.id} id={cat.id} className={`${sectionBg} py-20 lg:py-28 px-6 scroll-mt-24`}>
            <div className="max-w-7xl mx-auto">
              {/* Category hero — big cover image + big name */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
                <div className="lg:col-span-7 relative rounded-3xl overflow-hidden h-72 lg:h-96 shadow-soft">
                  {cat.coverImage ? (
                    <Image
                      src={cat.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      quality={90}
                      className="object-cover"
                      style={{ objectPosition: cat.coverPosition ?? "50% 50%" }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#292524] to-[#0c0a09]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-5 left-5 flex items-center gap-2 text-white/85 text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-6 h-px bg-white/50" />
                    0{catIdx + 1}
                  </div>
                </div>

                <div className="lg:col-span-5 lg:pl-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dc2626] mb-3">
                    {lang === "sq" ? "Kategori" : "Category"}
                  </p>
                  <h2 className="text-4xl lg:text-5xl font-bold text-[#1c1917] tracking-tight leading-[1.05] mb-4">
                    {lang === "sq" ? cat.name_sq : cat.name_en}
                  </h2>
                  <p className="text-[#57534e] text-sm">
                    {catSubs.length} {catSubs.length === 1
                      ? (lang === "sq" ? "linjë produkti" : "product line")
                      : (lang === "sq" ? "linja produkti" : "product lines")}
                  </p>
                </div>
              </div>

              {catSubs.length === 0 ? (
                <div className="py-12 text-center text-[#57534e] text-sm border-y border-[#e3ddd1]">
                  {lang === "sq" ? "Nuk ka nën-kategori ende." : "No subcategories yet."}
                </div>
              ) : (
                <div className="space-y-20">
                  {catSubs.map((sub, subIdx) => {
                    const subImages = images.filter((img) => img.section === sub.id).sort((a, b) => a.order - b.order);
                    const desc = lang === "sq" ? sub.desc_sq : sub.desc_en;
                    return (
                      <div key={sub.id} id={sub.id} className="scroll-mt-24">
                        {/* Subcategory header — number + name + description, two-column */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 pb-6 border-b border-[#e3ddd1]">
                          <div className="lg:col-span-4 flex items-start gap-4">
                            <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums mt-1">
                              {String(subIdx + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <h3 className="text-2xl lg:text-3xl font-bold text-[#1c1917] tracking-tight leading-tight">
                                {lang === "sq" ? sub.name_sq : sub.name_en}
                              </h3>
                              {sub.modelUrl && (
                                <button
                                  onClick={() => setModel3d({ src: sub.modelUrl!, alt: lang === "sq" ? sub.name_sq : sub.name_en })}
                                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1917] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#dc2626] transition-colors"
                                >
                                  <Box size={13} /> {lang === "sq" ? "Shiko 3D" : "View 3D"}
                                </button>
                              )}
                            </div>
                          </div>
                          {desc && (
                            <div className="lg:col-span-7 lg:col-start-6">
                              <p className="text-[#57534e] text-base leading-relaxed">{desc}</p>
                            </div>
                          )}
                        </div>

                        {/* Photos */}
                        {subImages.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                            {subImages.map((img) => (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => setLightbox(img)}
                                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer bg-[#f2ede4] shadow-soft hover:shadow-elevated transition-shadow p-0 border-0"
                              >
                                <Image
                                  src={img.url}
                                  alt=""
                                  fill
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  quality={85}
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-10 text-center text-[#57534e]/70 text-sm bg-[#f2ede4] rounded-2xl border border-[#e3ddd1]">
                            {lang === "sq" ? "Foto do të vijnë së shpejti." : "Photos coming soon."}
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

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section className="bg-[#0c0a09] py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e8b473] mb-4 flex items-center gap-3">
                <span className="w-10 h-px bg-[#e8b473]" />
                {lang === "sq" ? "I gatshëm të fillojmë?" : "Ready to start?"}
              </p>
              <h3 className="text-3xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight max-w-3xl mb-4">
                {p.cta_title}
              </h3>
              <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-2xl">{p.cta_desc}</p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#c86b3c] text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-[#a54f24] transition-colors no-underline w-full lg:w-auto shadow-lg shadow-[#c86b3c]/25"
              >
                {p.cta_btn}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="tel:+355692075317"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-white/40 text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-white hover:text-[#0c0a09] transition-colors no-underline w-full lg:w-auto"
              >
                <Phone size={16} /> +355 69 207 5317
              </a>
            </div>
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
        <div
          className="fixed inset-0 bg-black/92 z-[9999] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors touch-manipulation"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <div className="max-w-6xl max-h-[92vh] relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt=""
              className="max-h-[92vh] max-w-full w-auto h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
