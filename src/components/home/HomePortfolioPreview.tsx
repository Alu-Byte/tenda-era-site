"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";

const placeholders = [
  { label: "Beach Club Canopy", location: "Durrës" },
  { label: "Restaurant Awning", location: "Tiranë" },
  { label: "Shop Facade", location: "Shkodër" },
  { label: "Hotel Pool Umbrellas", location: "Sarandë" },
  { label: "Bar Terrace", location: "Vlorë" },
];

export default function HomePortfolioPreview() {
  const { t } = useLang();
  const ps = t.portfolio_section;

  return (
    <section className="bg-[#1a1a1a] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{ps.label}</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight">{ps.title}</h2>
          </div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-[#c0231e] font-semibold hover:gap-3 transition-all touch-manipulation">
            {ps.see_all} <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {placeholders.map((item, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${i === 0 ? "row-span-2 col-span-1" : ""}`}
            >
              <div
                className={`w-full bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] flex items-end p-5 group-hover:from-[#c0231e]/20 transition-all duration-300 ${
                  i === 0 ? "h-full min-h-[420px]" : "h-52"
                }`}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #c0231e 0, #c0231e 1px, transparent 0, transparent 50%)`,
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10">
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                  <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5">📍 {item.location}</p>
                </div>
                <div className="absolute inset-0 bg-[#c0231e]/0 group-hover:bg-[#c0231e]/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight size={18} className="text-[#1a1a1a]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
