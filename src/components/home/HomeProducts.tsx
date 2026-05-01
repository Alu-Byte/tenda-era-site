"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { Category, Subcategory } from "@/types";

interface Props {
  categories: Category[];
  subcategories: Subcategory[];
}

const catColors: Record<string, string> = {
  tenda: "from-[#1a1a1a] to-[#2d2d2d]",
  cadra: "from-[#c0231e] to-[#9a1c18]",
};
const catColorsFallback = ["from-[#1a1a1a] to-[#2d2d2d]", "from-[#c0231e] to-[#9a1c18]"];

export default function HomeProducts({ categories, subcategories }: Props) {
  const { lang, t } = useLang();
  const ps = t.products_section;

  const features = [
    { title: ps.feat1_title, desc: ps.feat1_desc },
    { title: ps.feat2_title, desc: ps.feat2_desc },
    { title: ps.feat3_title, desc: ps.feat3_desc },
  ];

  return (
    <section className="bg-[#faf8f4] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{ps.label}</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">{ps.title}</h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-[#1a1a1a] font-semibold hover:text-[#c0231e] transition-colors">
            {ps.see_all} <ArrowRight size={18} />
          </Link>
        </div>

        {/* Two main category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {categories.map((cat, i) => {
            const subs = subcategories.filter((s) => s.categoryId === cat.id);
            const color = catColors[cat.id] ?? catColorsFallback[i % catColorsFallback.length];
            return (
              <Link key={cat.id} href={`/products#${cat.id}`} className="group relative rounded-3xl overflow-hidden touch-manipulation">
                <div className={`bg-gradient-to-br ${color} p-8 min-h-[260px] flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-1`}>
                  <div className="flex items-start justify-between">
                    <span className="text-6xl opacity-80">{cat.icon}</span>
                    <ArrowRight size={20} className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                  <div>
                    <h3 className="text-white font-display text-3xl font-bold mb-2">
                      {lang === "sq" ? cat.name_sq : cat.name_en}
                    </h3>
                    {subs.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {subs.slice(0, 4).map((sub) => (
                          <span key={sub.id} className="text-xs bg-white/15 text-white/80 px-2.5 py-1 rounded-full">
                            {lang === "sq" ? sub.name_sq : sub.name_en}
                          </span>
                        ))}
                        {subs.length > 4 && <span className="text-xs text-white/50">+{subs.length - 4} more</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </div>

        {/* Feature strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-7 border border-[#e5e5e5] flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-[#c0231e] mt-2 shrink-0" />
              <div>
                <h4 className="font-semibold text-[#1a1a1a] mb-1">{f.title}</h4>
                <p className="text-sm text-[#2d2d2d]/60 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
