"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useLang } from "@/lib/LangContext";

export default function HomeCTA() {
  const { t } = useLang();
  const c = t.cta;

  return (
    <section className="bg-[#faf8f4] py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-3xl p-14 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#c0231e]/10" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />
          <div className="relative z-10">
            <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-4">{c.label}</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{c.title}</h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">{c.desc}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-[#c0231e] text-white font-semibold rounded-full hover:bg-[#9a1c18] active:bg-[#9a1c18] transition-colors touch-manipulation hover:gap-3">
                {c.btn_quote} <ArrowRight size={18} />
              </Link>
              <a href="tel:+355692075317" className="inline-flex items-center gap-2 px-7 py-4 border border-white/30 text-white font-semibold rounded-full hover:border-white hover:bg-white/10 active:bg-white/10 transition-all touch-manipulation">
                <Phone size={18} /> {c.btn_call}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
