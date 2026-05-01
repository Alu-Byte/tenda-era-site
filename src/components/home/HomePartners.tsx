"use client";

import { useLang } from "@/lib/LangContext";

const partners = ["Corti", "Calbari", "Mehler", "Frigerio"];

export default function HomePartners() {
  const { t } = useLang();

  return (
    <section className="bg-white py-16 border-y border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-[#2d2d2d]/40 uppercase tracking-widest font-semibold mb-10">
          {t.partners_section.label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12">
          {partners.map((p) => (
            <div key={p} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border-2 border-[#e5e5e5] group-hover:border-[#c0231e] transition-colors flex items-center justify-center">
                <span className="text-[#c0231e] font-bold text-sm">{p[0]}</span>
              </div>
              <span className="font-display text-2xl font-semibold text-[#1a1a1a]/70 group-hover:text-[#1a1a1a] transition-colors">
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
