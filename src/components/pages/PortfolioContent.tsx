"use client";

import { useLang } from "@/lib/LangContext";
import PortfolioGallery from "@/components/PortfolioGallery";
import type { SiteImage } from "@/types";

export default function PortfolioContent({ images }: { images: SiteImage[] }) {
  const { t } = useLang();
  const p = t.portfolio_page;

  return (
    <>
      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{p.label}</p>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">{p.title}</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{p.desc}</p>
        </div>
      </section>

      <div className="bg-[#1a1a1a] h-12 relative">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#faf8f4]" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </div>

      <section className="bg-[#faf8f4] py-16 px-6 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <PortfolioGallery images={images} />
        </div>
      </section>
    </>
  );
}
