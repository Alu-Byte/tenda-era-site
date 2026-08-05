"use client";

import { Award, Shield, Wrench } from "lucide-react";
import { useLang } from "@/lib/LangContext";

export default function HomeStats() {
  const { lang } = useLang();

  const items = lang === "sq"
    ? [
        { icon: Award, k: "Pëlhura europiane", v: "Mehler · Corti · Calbari · Frigerio", note: "Certifikime CE, të garantuara për 5–10 vjet." },
        { icon: Wrench, k: "Prodhim + Montim", v: "Ekipi ynë vjen te ju", note: "Matje në terren, prodhim në punishten tonë, instalim profesional." },
        { icon: Shield, k: "Mirëmbajtje pas montimit", v: "Servis + rifreskim pëlhurash", note: "Kontratë vjetore për biznese, riparim urgjent në 48 orë." },
      ]
    : [
        { icon: Award, k: "European fabrics", v: "Mehler · Corti · Calbari · Frigerio", note: "CE-certified, backed by 5–10 year manufacturer warranties." },
        { icon: Wrench, k: "In-house build + install", v: "Our team comes to you", note: "On-site measurement, workshop fabrication, professional installation." },
        { icon: Shield, k: "Post-installation service", v: "Service + fabric refresh", note: "Annual contracts for businesses, 48-hour emergency repair." },
      ];

  return (
    <section className="bg-white border-y border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {items.map((it, i) => (
            <div key={it.k} className="relative">
              {i > 0 && (
                <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-px bg-[#e7e5e4]" />
              )}
              <div className="mb-5 w-11 h-11 border border-[#e7e5e4] flex items-center justify-center">
                <it.icon size={18} className="text-[#0f766e]" strokeWidth={1.75} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#57534e] mb-2">{it.k}</p>
              <p className="text-lg font-semibold text-[#1c1917] leading-snug mb-3">{it.v}</p>
              <p className="text-sm text-[#57534e] leading-relaxed">{it.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
