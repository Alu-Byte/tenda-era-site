"use client";

import { useLang } from "@/lib/LangContext";
import PortfolioGallery from "@/components/PortfolioGallery";
import type { SiteImage } from "@/types";

export default function PortfolioContent({ images }: { images: SiteImage[] }) {
  const { t } = useLang();
  const p = t.portfolio_page;

  return (
    <>
      {/* Compact page header on cream — no full-height dark hero here since the photos below are the real hero */}
      <section className="bg-[#faf7f2] pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 border-b border-[#e3ddd1]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dc2626] mb-3">
                — {p.label}
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1c1917] leading-[1.05] tracking-tight">
                {p.title}
              </h1>
            </div>
            <div className="lg:col-span-6 lg:col-start-6">
              <p className="text-[#57534e] text-base lg:text-lg leading-relaxed">{p.desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf7f2] py-12 lg:py-16 px-6 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <PortfolioGallery images={images} />
        </div>
      </section>
    </>
  );
}
