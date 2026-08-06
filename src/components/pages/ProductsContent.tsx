"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X, Box, ArrowUpRight, Phone, ChevronLeft, ChevronRight,
  LayoutGrid, ImageIcon, Sparkles, Award, ShieldCheck, Wrench, Package,
} from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { Category, Subcategory, SiteImage } from "@/types";
import ModelViewer from "@/components/ModelViewer";
import Reveal from "@/components/Reveal";

interface Props {
  categories: Category[];
  subcategories: Subcategory[];
  images: SiteImage[];
}

// Uniform 3-across desktop grid so any number of items per category renders
// without partial rows or gaps. Each category is its own grid, so adding
// more subcategories just extends the last row cleanly.

export default function ProductsContent({ categories, subcategories, images }: Props) {
  const { lang, t } = useLang();
  const p = t.products_page;

  const [activeCat, setActiveCat] = useState<string>("all");
  const [openSub, setOpenSub] = useState<Subcategory | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [model3d, setModel3d] = useState<{ src: string; alt: string } | null>(null);

  // Derived collections
  const orderedCats = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories]
  );

  const orderedSubs = useMemo(
    () => [...subcategories].sort((a, b) => a.order - b.order),
    [subcategories]
  );

  const filteredSubs = useMemo(
    () => (activeCat === "all" ? orderedSubs : orderedSubs.filter((s) => s.categoryId === activeCat)),
    [activeCat, orderedSubs]
  );

  const catById = useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of orderedCats) m.set(c.id, c);
    return m;
  }, [orderedCats]);

  const imagesBySub = useMemo(() => {
    const m = new Map<string, SiteImage[]>();
    for (const img of images) {
      const arr = m.get(img.section) ?? [];
      arr.push(img);
      m.set(img.section, arr);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.order - b.order);
    return m;
  }, [images]);

  const totalPhotos = useMemo(
    () => orderedSubs.reduce((sum, s) => sum + (imagesBySub.get(s.id)?.length ?? 0), 0),
    [orderedSubs, imagesBySub]
  );

  // Sheet: gallery for currently opened subcategory
  const sheetImages = openSub ? imagesBySub.get(openSub.id) ?? [] : [];
  const sheetHero = sheetImages[galleryIdx] ?? null;

  // Open/close sheet with body scroll lock
  const openSheet = (sub: Subcategory) => {
    setOpenSub(sub);
    setGalleryIdx(0);
    setLightboxOpen(false);
  };
  const closeSheet = useCallback(() => {
    setOpenSub(null);
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!openSub) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [openSub]);

  // Keyboard navigation for sheet + lightbox
  const stepGallery = useCallback((dir: -1 | 1) => {
    if (sheetImages.length === 0) return;
    setGalleryIdx((i) => (i + dir + sheetImages.length) % sheetImages.length);
  }, [sheetImages.length]);

  useEffect(() => {
    if (!openSub) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else closeSheet();
      } else if (e.key === "ArrowLeft") stepGallery(-1);
      else if (e.key === "ArrowRight") stepGallery(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSub, lightboxOpen, closeSheet, stepGallery]);

  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden text-white bg-black">
        {/* Subtle top vignette so the canvas feels lit from above */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 700px at 50% 15%, rgba(255,255,255,0.05), transparent 65%)",
          }}
        />
        {/* Soft red glow — one on each corner for warmth without dominating */}
        <div className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-[#dc2626]/12 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-[#991b1b]/12 blur-[120px] pointer-events-none" />
        {/* Big background wordmark — decorative, fills the empty space */}
        <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pointer-events-none select-none pr-4 lg:pr-10 overflow-hidden">
          <span
            className="font-bold tracking-[-0.04em] leading-none whitespace-nowrap text-white/[0.035]"
            style={{ fontSize: "clamp(140px, 22vw, 340px)" }}
          >
            1994
          </span>
        </div>
        {/* Small "EST." kicker paired with the wordmark, top-right */}
        <div className="absolute top-24 right-6 lg:right-10 hidden md:block pointer-events-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/25">
            Est. · Since 1994
          </p>
        </div>
        {/* Grain */}
        <div className="absolute inset-0 grain" />
        {/* Red top line — brand accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #dc2626 50%, transparent)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-16 lg:pt-44 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6 animate-fade-up">
                <Sparkles size={13} className="text-[#fca5a5]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#fca5a5]">
                  {p.label}
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-7xl xl:text-[6rem] font-bold leading-[0.95] tracking-tight animate-fade-up"
                style={{ animationDelay: "0.08s", opacity: 0, animationFillMode: "forwards" }}
              >
                {p.title}
              </h1>
              <p
                className="mt-6 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed animate-fade-up"
                style={{ animationDelay: "0.18s", opacity: 0, animationFillMode: "forwards" }}
              >
                {p.subtitle}
              </p>
            </div>

            {/* Live stats sidebar */}
            <div
              className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10 animate-fade-up"
              style={{ animationDelay: "0.28s", opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-5">
                <Stat n={orderedCats.length} label={lang === "sq" ? "Kategori" : "Categories"} />
                <Stat n={orderedSubs.length} label={lang === "sq" ? "Linja produkti" : "Product lines"} />
                <Stat n={totalPhotos} label={lang === "sq" ? "Foto" : "Photos"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HIGHLIGHTS STRIP ═══════════════ */}
      <section className="bg-white border-b border-[#e3ddd1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <Highlight
              icon={Award}
              title={lang === "sq" ? "Cilësi Premium" : "Premium Quality"}
              desc={lang === "sq" ? "Materiale EU të çertifikuara" : "Certified EU materials"}
            />
            <Highlight
              icon={ShieldCheck}
              title={lang === "sq" ? "Garanci 5-vjeçare" : "5-Year Warranty"}
              desc={lang === "sq" ? "E mbuluar nga prodhuesi" : "Backed by the maker"}
            />
            <Highlight
              icon={Wrench}
              title={lang === "sq" ? "Montim i Përfshirë" : "Install Included"}
              desc={lang === "sq" ? "Ekipi ynë i çertifikuar" : "Our certified crew"}
            />
            <Highlight
              icon={Sparkles}
              title={lang === "sq" ? "Modele të Personalizuara" : "Custom Designs"}
              desc={lang === "sq" ? "Sipas hapësirës suaj" : "Made for your space"}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ STICKY FILTER BAR ═══════════════ */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#e3ddd1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center gap-3 overflow-x-auto scrollbar-thin">
          <div className="hidden sm:flex items-center gap-2 shrink-0 mr-2 text-[#57534e]">
            <LayoutGrid size={15} />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              {lang === "sq" ? "Filtro" : "Filter"}
            </span>
          </div>

          <FilterChip
            active={activeCat === "all"}
            onClick={() => setActiveCat("all")}
            label={lang === "sq" ? "Të gjitha" : "All"}
            count={orderedSubs.length}
          />
          {orderedCats.map((cat) => {
            const count = orderedSubs.filter((s) => s.categoryId === cat.id).length;
            return (
              <FilterChip
                key={cat.id}
                active={activeCat === cat.id}
                onClick={() => setActiveCat(cat.id)}
                label={lang === "sq" ? cat.name_sq : cat.name_en}
                count={count}
              />
            );
          })}

          <span className="shrink-0 ml-auto hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#57534e] tabular-nums">
            {String(filteredSubs.length).padStart(2, "0")}
            <span className="text-[#a8a29e] font-sans font-normal normal-case">
              {lang === "sq" ? "rezultate" : "results"}
            </span>
          </span>
        </div>
      </div>

      {/* ═══════════════ GROUPED CATEGORY SECTIONS ═══════════════ */}
      <section className="bg-[#faf7f2] py-16 lg:py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {filteredSubs.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-flex w-16 h-16 rounded-full bg-white border border-[#e3ddd1] items-center justify-center mb-5">
                <ImageIcon size={22} className="text-[#a8a29e]" />
              </div>
              <p className="text-[#57534e]">
                {lang === "sq" ? "Nuk ka produkte për këtë filter." : "No products for this filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-20 lg:space-y-28">
              {orderedCats.map((cat, catIdx) => {
                if (activeCat !== "all" && activeCat !== cat.id) return null;
                const catSubs = orderedSubs.filter((s) => s.categoryId === cat.id);
                if (catSubs.length === 0) return null;
                const catName = lang === "sq" ? cat.name_sq : cat.name_en;

                return (
                  <div key={cat.id} id={cat.id} className="scroll-mt-24">
                    {/* Category header */}
                    <Reveal>
                      <div className="mb-10 lg:mb-12 flex items-end justify-between gap-6 flex-wrap">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">
                              {String(catIdx + 1).padStart(2, "0")}
                            </span>
                            <span className="w-10 h-px bg-[#dc2626]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
                              {lang === "sq" ? "Kategoria" : "Category"}
                            </span>
                          </div>
                          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1c1917] tracking-tight leading-[1.02]">
                            {catName}
                          </h2>
                        </div>
                        <p className="text-[#57534e] text-sm lg:text-base tabular-nums">
                          {String(catSubs.length).padStart(2, "0")}{" "}
                          {catSubs.length === 1
                            ? (lang === "sq" ? "linjë produkti" : "product line")
                            : (lang === "sq" ? "linja produkti" : "product lines")}
                        </p>
                      </div>
                    </Reveal>

                    {/* Uniform grid — 3 across on desktop, 2 on tablet, 1 on mobile.
                        Any card count fills cleanly (partial last row just has
                        trailing empty cells at the end, never mid-grid gaps). */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-[280px] sm:auto-rows-[340px] lg:auto-rows-[380px]">
                      {catSubs.map((sub, i) => {
                        const subImages = imagesBySub.get(sub.id) ?? [];
                        const cover = subImages[0];
                        const name = lang === "sq" ? sub.name_sq : sub.name_en;
                        const desc = lang === "sq" ? sub.desc_sq : sub.desc_en;

                        return (
                          <Reveal
                            key={sub.id}
                            delay={((i % 3) + 1) as 1 | 2 | 3}
                            className="h-full"
                          >
                            <button
                              type="button"
                              onClick={() => openSheet(sub)}
                              className="group relative w-full h-full rounded-2xl overflow-hidden bg-[#292524] text-left p-0 border-0 cursor-pointer shadow-soft hover:shadow-elevated transition-shadow"
                            >
                              {cover ? (
                                <Image
                                  src={cover.url}
                                  alt=""
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  quality={75}
                                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                                />
                              ) : (
                                <PatternFallback />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                              <div className="absolute inset-0 bg-[#dc2626]/0 group-hover:bg-[#dc2626]/10 transition-colors duration-500" />

                              {/* Top row: index + photo count */}
                              <div className="absolute top-4 left-4 right-4 flex items-start justify-between text-white/85">
                                <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.16em] text-white/80">
                                  <span className="w-4 h-px bg-white/50" />
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                {subImages.length > 0 && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[11px] font-semibold tabular-nums">
                                    <ImageIcon size={11} />
                                    {subImages.length}
                                  </span>
                                )}
                              </div>

                              {/* Bottom content */}
                              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 text-white">
                                <h3 className="text-xl lg:text-2xl font-bold leading-[1.15] tracking-tight mb-1.5">
                                  {name}
                                </h3>
                                {desc && (
                                  <p className="text-sm text-white/75 leading-snug line-clamp-2 max-w-[42ch] mb-4">
                                    {desc}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 transition-transform duration-500 group-hover:translate-x-1">
                                  {lang === "sq" ? "Shiko detajet" : "View details"}
                                  <ArrowUpRight
                                    size={14}
                                    className="transition-transform duration-500 group-hover:rotate-45"
                                    strokeWidth={2.5}
                                  />
                                </div>
                              </div>

                              {/* Corner accent */}
                              <div className="absolute top-0 right-0 w-[46px] h-[46px] overflow-hidden pointer-events-none">
                                <div className="absolute top-0 right-0 w-[2px] h-6 bg-[#dc2626] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />
                                <div className="absolute top-0 right-0 h-[2px] w-6 bg-[#dc2626] scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500" />
                              </div>
                            </button>
                          </Reveal>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="bg-[#0c0a09] py-20 lg:py-28 px-6 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#dc2626]/20 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <Reveal className="lg:col-span-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#fca5a5] mb-4 flex items-center gap-3">
                <span className="w-10 h-px bg-[#fca5a5]" />
                {lang === "sq" ? "I gatshëm të fillojmë?" : "Ready to start?"}
              </p>
              <h3 className="text-3xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight max-w-3xl mb-4">
                {p.cta_title}
              </h3>
              <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-2xl">{p.cta_desc}</p>
            </Reveal>
            <Reveal className="lg:col-span-4 flex flex-col gap-3 lg:items-end" delay={2}>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors no-underline w-full lg:w-auto shadow-lg shadow-[#dc2626]/40 animate-pulse-glow"
              >
                {p.cta_btn}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="tel:+355692075317"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-white/40 text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-white hover:text-[#0c0a09] transition-colors no-underline w-full lg:w-auto"
              >
                <Phone size={16} /> +355 69 207 5317/8/9
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ DETAIL SHEET ═══════════════ */}
      {openSub && (() => {
        const cat = catById.get(openSub.categoryId);
        const name = lang === "sq" ? openSub.name_sq : openSub.name_en;
        const desc = lang === "sq" ? openSub.desc_sq : openSub.desc_en;
        const catName = cat ? (lang === "sq" ? cat.name_sq : cat.name_en) : "";
        return (
          <div
            className="fixed inset-0 z-[80] flex items-end lg:items-center justify-center p-0 lg:p-6"
            onClick={closeSheet}
            role="dialog"
            aria-modal="true"
            aria-label={name}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

            <div
              className="relative w-full lg:max-w-6xl max-h-[92vh] lg:max-h-[86vh] bg-white lg:rounded-3xl rounded-t-3xl overflow-hidden shadow-elevated animate-sheet-in flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Grabber (mobile) */}
              <div className="lg:hidden pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1.5 rounded-full bg-[#e3ddd1]" />
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={closeSheet}
                className="absolute top-4 right-4 lg:top-5 lg:right-5 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1c1917] shadow-md flex items-center justify-center transition-colors"
                aria-label={lang === "sq" ? "Mbylle" : "Close"}
              >
                <X size={18} />
              </button>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Gallery pane */}
                  <div className="lg:col-span-7 bg-[#f2ede4]">
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[560px] bg-gradient-to-br from-[#1a0808] via-[#0c0a09] to-[#160a08]">
                      {sheetHero ? (
                        <button
                          type="button"
                          onClick={() => setLightboxOpen(true)}
                          className="absolute inset-0 p-0 border-0 cursor-zoom-in group"
                          aria-label={lang === "sq" ? "Zmadho foton" : "Zoom photo"}
                        >
                          <Image
                            key={sheetHero.id}
                            src={sheetHero.url}
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            quality={90}
                            className="object-cover animate-fade-in"
                          />
                          {sheetImages.length > 1 && (
                            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold tabular-nums">
                              {galleryIdx + 1} / {sheetImages.length}
                            </div>
                          )}
                        </button>
                      ) : (
                        <>
                          <div
                            className="absolute inset-0 opacity-[0.06]"
                            style={{
                              backgroundImage:
                                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                              backgroundSize: "48px 48px",
                            }}
                          />
                          <div className="absolute -top-24 -right-24 w-[360px] h-[360px] rounded-full bg-[#dc2626]/30 blur-[110px]" />
                          <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full bg-[#991b1b]/35 blur-[100px]" />
                          <div className="absolute inset-0 grain" />
                          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm font-semibold uppercase tracking-widest">
                            {lang === "sq" ? "Foto do të vijnë së shpejti" : "Photos coming soon"}
                          </div>
                        </>
                      )}

                      {sheetImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); stepGallery(-1); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#1c1917] shadow flex items-center justify-center transition-colors"
                            aria-label={lang === "sq" ? "Foto e mëparshme" : "Previous photo"}
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); stepGallery(1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#1c1917] shadow flex items-center justify-center transition-colors"
                            aria-label={lang === "sq" ? "Foto tjetër" : "Next photo"}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {sheetImages.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto scrollbar-thin border-t border-[#e3ddd1]">
                        {sheetImages.map((img, i) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => setGalleryIdx(i)}
                            className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden ring-2 transition-all p-0 border-0 cursor-pointer ${
                              i === galleryIdx
                                ? "ring-[#dc2626] scale-105"
                                : "ring-transparent hover:ring-[#e3ddd1] opacity-70 hover:opacity-100"
                            }`}
                            aria-label={`${lang === "sq" ? "Foto" : "Photo"} ${i + 1}`}
                          >
                            <Image src={img.url} alt="" fill sizes="64px" quality={75} className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info pane */}
                  <div className="lg:col-span-5 p-6 lg:p-10 flex flex-col">
                    <div className="mb-5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[10px] font-bold uppercase tracking-[0.18em]">
                        {catName}
                      </span>
                      {sheetImages.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#faf7f2] border border-[#e3ddd1] text-[#57534e] text-[10px] font-bold uppercase tracking-[0.18em]">
                          <ImageIcon size={10} />
                          {sheetImages.length} {lang === "sq" ? "foto" : "photos"}
                        </span>
                      )}
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight leading-[1.05] mb-5">
                      {name}
                    </h2>

                    {desc ? (
                      <p className="text-[#57534e] text-base lg:text-lg leading-relaxed mb-8">{desc}</p>
                    ) : (
                      <p className="text-[#a8a29e] italic text-sm mb-8">
                        {lang === "sq" ? "Përshkrimi do të shtohet së shpejti." : "Description coming soon."}
                      </p>
                    )}

                    <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#e3ddd1]">
                      <Link
                        href="/contact"
                        className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors no-underline shadow-md shadow-[#dc2626]/30"
                      >
                        {lang === "sq" ? "Kërko Ofertë" : "Get a Quote"}
                        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                      <div className="grid grid-cols-2 gap-3">
                        {openSub.modelUrl && (
                          <button
                            type="button"
                            onClick={() => setModel3d({ src: openSub.modelUrl!, alt: name })}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-[#1c1917] text-[#1c1917] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#1c1917] hover:text-white transition-colors"
                          >
                            <Box size={13} /> {lang === "sq" ? "Shiko 3D" : "View 3D"}
                          </button>
                        )}
                        <a
                          href="tel:+355692075317"
                          className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-[#e3ddd1] text-[#1c1917] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#faf7f2] transition-colors no-underline ${
                            openSub.modelUrl ? "" : "col-span-2"
                          }`}
                        >
                          <Phone size={13} /> {lang === "sq" ? "Telefono" : "Call"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══════════════ FULLSCREEN LIGHTBOX ═══════════════ */}
      {openSub && lightboxOpen && sheetHero && (
        <div
          className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors z-10"
            aria-label={lang === "sq" ? "Mbylle" : "Close"}
          >
            <X size={22} />
          </button>
          {sheetImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); stepGallery(-1); }}
                className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors z-10"
                aria-label={lang === "sq" ? "Foto e mëparshme" : "Previous"}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); stepGallery(1); }}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors z-10"
                aria-label={lang === "sq" ? "Foto tjetër" : "Next"}
              >
                <ChevronRight size={22} />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-bold uppercase tracking-widest tabular-nums">
                {galleryIdx + 1} / {sheetImages.length}
              </div>
            </>
          )}
          <div className="relative max-w-6xl max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={sheetHero.id}
              src={sheetHero.url}
              alt=""
              className="max-h-[92vh] max-w-full w-auto h-auto object-contain rounded-xl animate-fade-in"
            />
          </div>
        </div>
      )}

      {/* 3D Model Viewer */}
      {model3d && <ModelViewer src={model3d.src} alt={model3d.alt} onClose={() => setModel3d(null)} />}
    </>
  );
}

/* ─────────────────── Presentational sub-components ─────────────────── */

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-3xl lg:text-4xl font-bold tracking-tight tabular-nums text-white">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 mt-1">
        {label}
      </span>
    </div>
  );
}

/** Rich patterned background for cards without a cover photo. */
function PatternFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1a0808] via-[#0c0a09] to-[#160a08] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 18px)",
        }}
      />
      <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-[#dc2626]/35 blur-[90px]" />
      <div className="absolute -bottom-24 -left-24 w-[240px] h-[240px] rounded-full bg-[#991b1b]/40 blur-[80px]" />
      <div className="absolute inset-0 grain" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center">
          <Package size={30} className="text-[#fca5a5]" strokeWidth={1.6} />
        </div>
      </div>
    </div>
  );
}

function Highlight({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="group flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center shrink-0 group-hover:bg-[#dc2626] group-hover:border-[#dc2626] transition-colors">
        <Icon size={18} className="text-[#dc2626] group-hover:text-white transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#1c1917] leading-tight">{title}</p>
        <p className="text-xs text-[#57534e] mt-1 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function FilterChip({
  active, onClick, label, count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
        active
          ? "bg-[#1c1917] border-[#1c1917] text-white shadow-md"
          : "bg-white border-[#e3ddd1] text-[#1c1917] hover:border-[#1c1917]"
      }`}
    >
      {label}
      <span
        className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-[#faf7f2] text-[#57534e]"
        }`}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}
