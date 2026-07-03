"use client";

import { useLang } from "@/lib/LangContext";

const partners = [
  { name: "Corti", country: "Italy" },
  { name: "Calbari", country: "Italy" },
  { name: "Mehler", country: "Germany" },
  { name: "Frigerio", country: "Italy" },
];

export default function HomePartners() {
  const { t } = useLang();

  return (
    <section className="bg-white py-14 lg:py-16 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[11px] text-neutral-400 uppercase tracking-[0.25em] font-bold mb-10">
          {t.partners_section.label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:gap-x-16">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center gap-3 group cursor-default">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 group-hover:border-[#e11d3c]/40 group-hover:from-[#fef2f4] transition-all flex items-center justify-center">
                <span className="text-[#e11d3c] font-bold text-base tracking-tight">{p.name[0]}</span>
              </div>
              <div>
                <p className="font-display text-xl lg:text-2xl font-semibold text-neutral-800 group-hover:text-neutral-950 transition-colors leading-tight tracking-tight">
                  {p.name}
                </p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">{p.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
