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
  // Duplicate the list — the marquee translates -50%, so the second copy
  // seamlessly takes the first's place with no visible jump.
  const loop = [...partners, ...partners];

  return (
    <section className="bg-[#f2ede4] border-y border-[#e3ddd1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-12">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e] mb-8">
          {t.partners_section.label}
        </p>

        {/* Marquee track — animates translateX(-50%) so items scroll left infinitely */}
        <div className="relative">
          {/* Left/right gradient fades so items appear to emerge from off-canvas */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f2ede4] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f2ede4] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-14 lg:gap-20 animate-marquee-slow whitespace-nowrap">
            {loop.map((p, i) => (
              <div key={`${p.name}-${i}`} className="flex items-baseline gap-3 shrink-0">
                <span className="text-2xl lg:text-3xl font-bold text-[#1c1917] tracking-tight">{p.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#dc2626]">{p.country}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
