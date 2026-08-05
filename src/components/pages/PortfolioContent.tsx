"use client";

import { useLang } from "@/lib/LangContext";
import PortfolioGallery from "@/components/PortfolioGallery";
import type { SiteImage } from "@/types";

export default function PortfolioContent({ images }: { images: SiteImage[] }) {
  const { t } = useLang();
  const p = t.portfolio_page;

  return (
    <>
      <section className="relative pt-36 pb-24 px-6 overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#0d5c63]/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#4a9d95]/10 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="inline-flex items-center gap-2 text-[#4a9d95] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <span className="w-6 h-px bg-[#4a9d95]" />
            {p.label}
            <span className="w-6 h-px bg-[#4a9d95]" />
          </p>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">{p.title}</h1>
          <p className="text-white/65 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">{p.desc}</p>
        </div>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 right-0 w-full h-16 block">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1350,50 1440,30 L1440,80 L0,80 Z" fill="#faf7f2" />
        </svg>
      </section>

      <section className="bg-[#faf7f2] py-16 lg:py-20 px-6 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <PortfolioGallery images={images} />
        </div>
      </section>
    </>
  );
}
