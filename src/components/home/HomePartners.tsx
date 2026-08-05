"use client";

import { useLang } from "@/lib/LangContext";

const partners = [
  { name: "Corti", country: "IT" },
  { name: "Calbari", country: "IT" },
  { name: "Mehler", country: "DE" },
  { name: "Frigerio", country: "IT" },
];

export default function HomePartners() {
  const { t } = useLang();

  return (
    <section className="bg-[#f2ede4] border-y border-[#e3ddd1]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
              {t.partners_section.label}
            </p>
          </div>
          <div className="lg:col-span-9">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {partners.map((p) => (
                <li key={p.name} className="flex items-baseline gap-3">
                  <span className="text-2xl lg:text-3xl font-bold text-[#1c1917] tracking-tight">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#57534e]">
                    {p.country}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
