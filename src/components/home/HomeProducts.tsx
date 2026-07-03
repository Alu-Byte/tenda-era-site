"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { Category, Subcategory } from "@/types";

interface Props {
  categories: Category[];
  subcategories: Subcategory[];
}

const catColors: Record<string, string> = {
  tenda: "from-neutral-900 to-neutral-700",
  cadra: "from-[#e11d3c] to-[#b91429]",
};
const catColorsFallback = ["from-neutral-900 to-neutral-700", "from-[#e11d3c] to-[#b91429]"];

export default function HomeProducts({ categories, subcategories }: Props) {
  const { lang, t } = useLang();
  const ps = t.products_section;

  const features = [
    { title: ps.feat1_title, desc: ps.feat1_desc },
    { title: ps.feat2_title, desc: ps.feat2_desc },
    { title: ps.feat3_title, desc: ps.feat3_desc },
  ];

  return (
    <section className="bg-[#fbfaf6] py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <p className="inline-flex items-center gap-2 text-[#e11d3c] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-[#e11d3c]" />
              {ps.label}
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 leading-[1.1] tracking-tight max-w-xl">{ps.title}</h2>
          </div>
          <Link href="/products" className="group inline-flex items-center gap-2 text-neutral-800 font-semibold hover:text-[#e11d3c] transition-colors no-underline">
            {ps.see_all}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Two main category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-12">
          {categories.map((cat, i) => {
            const subs = subcategories.filter((s) => s.categoryId === cat.id);
            const color = catColors[cat.id] ?? catColorsFallback[i % catColorsFallback.length];
            return (
              <Link key={cat.id} href={`/products#${cat.id}`} className="group relative rounded-3xl overflow-hidden touch-manipulation shadow-soft hover:shadow-elevated transition-all no-underline">
                <div className={`relative bg-gradient-to-br ${color} p-8 min-h-[280px] flex flex-col justify-between transition-transform duration-500 group-hover:-translate-y-1`}>
                  {cat.coverImage && (
                    <>
                      <Image src={cat.coverImage} alt={lang === "sq" ? cat.name_sq : cat.name_en} fill className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: cat.coverPosition ?? "50% 50%" }} />
                      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-80 group-hover:opacity-70 transition-opacity`} />
                    </>
                  )}
                  <div className="relative flex items-start justify-between">
                    <span className="text-6xl opacity-80 drop-shadow-lg">{cat.icon}</span>
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors">
                      <ArrowRight size={18} className="text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <div className="relative">
                    <h3 className="text-white font-display text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                      {lang === "sq" ? cat.name_sq : cat.name_en}
                    </h3>
                    {subs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {subs.slice(0, 4).map((sub) => (
                          <span key={sub.id} className="text-xs bg-white/15 backdrop-blur-sm text-white/95 px-3 py-1 rounded-full font-medium">
                            {lang === "sq" ? sub.name_sq : sub.name_en}
                          </span>
                        ))}
                        {subs.length > 4 && <span className="text-xs text-white/70 px-2 py-1">+{subs.length - 4}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Feature strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {features.map((f, idx) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 lg:p-7 border border-neutral-100 hover:border-[#e11d3c]/25 hover:shadow-soft transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fef2f4] to-[#fce7ea] flex items-center justify-center text-[#e11d3c] font-bold text-sm group-hover:scale-110 transition-transform">
                  0{idx + 1}
                </div>
                <h4 className="font-semibold text-neutral-900 tracking-tight">{f.title}</h4>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
