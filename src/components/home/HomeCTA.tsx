"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useLang } from "@/lib/LangContext";

export default function HomeCTA() {
  const { t } = useLang();
  const c = t.cta;

  return (
    <section className="bg-[#fbfaf6] py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="relative rounded-[2rem] p-10 lg:p-16 overflow-hidden shadow-elevated"
          style={{
            background: "linear-gradient(135deg, #171717 0%, #262626 100%)",
          }}>
          {/* Glowing accents */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#e11d3c]/25 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#f43f5e]/15 blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }} />

          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 text-[#f43f5e] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse" />
              {c.label}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight max-w-2xl mx-auto">{c.title}</h2>
            <p className="text-white/65 text-base lg:text-lg mb-10 max-w-xl mx-auto leading-relaxed">{c.desc}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="group inline-flex items-center gap-2 px-7 py-4 bg-[#e11d3c] text-white font-semibold rounded-full hover:bg-[#b91429] transition-all touch-manipulation shadow-[0_10px_30px_-8px_rgba(225,29,60,0.6)] hover:-translate-y-0.5 no-underline">
                {c.btn_quote}
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="tel:+355692075317" className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-full hover:bg-white/15 hover:border-white/40 transition-all touch-manipulation no-underline">
                <Phone size={17} /> {c.btn_call}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
