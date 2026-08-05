"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { SiteImage } from "@/types";

const PLACEHOLDERS = [
  { label: "Beach Club Canopy", location: "Durrës" },
  { label: "Restaurant Awning", location: "Tiranë" },
  { label: "Shop Facade", location: "Shkodër" },
  { label: "Hotel Pool Umbrellas", location: "Sarandë" },
  { label: "Bar Terrace", location: "Vlorë" },
];

interface Props {
  images: SiteImage[];
}

export default function HomePortfolioPreview({ images }: Props) {
  const { t } = useLang();
  const ps = t.portfolio_section;

  const items = images.slice(0, 5);
  const hasImages = items.length > 0;

  return (
    <section className="bg-neutral-950 py-20 lg:py-28 relative overflow-hidden">
      {/* Soft accent glow */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#e11d3c]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-[#e11d3c]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="inline-flex items-center gap-2 text-[#f43f5e] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-[#f43f5e]" />
              {ps.label}
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight">{ps.title}</h2>
          </div>
          <Link href="/portfolio" className="group inline-flex items-center gap-2 text-[#f43f5e] font-semibold hover:text-white transition-colors touch-manipulation no-underline">
            {ps.see_all}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {hasImages ? (
            items.map((img, i) => (
              <div
                key={img.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ring-1 ring-white/10 hover:ring-white/25 transition-all ${
                  i === 0 ? "row-span-2 h-[420px]" : "h-52"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.title || img.originalName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all">
                    <p className="text-white font-semibold text-sm drop-shadow">{img.title}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            PLACEHOLDERS.map((item, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ring-1 ring-white/10 hover:ring-white/25 transition-all ${i === 0 ? "row-span-2" : ""}`}
              >
                <div
                  className={`w-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-end p-5 group-hover:from-[#e11d3c]/25 transition-all duration-500 ${
                    i === 0 ? "h-full min-h-[420px]" : "h-52"
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, #f43f5e 1px, transparent 0)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative z-10">
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-white/50 text-xs flex items-center gap-1 mt-1">
                      <MapPin size={11} /> {item.location}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity w-11 h-11 rounded-full bg-[#e11d3c] flex items-center justify-center shadow-lg shadow-[#e11d3c]/40">
                      <ArrowRight size={18} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
