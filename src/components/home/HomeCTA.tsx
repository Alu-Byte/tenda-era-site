"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import Reveal from "@/components/Reveal";

export default function HomeCTA() {
  const { t, lang } = useLang();
  const c = t.cta;

  return (
    <section className="bg-[#0c0a09] relative overflow-hidden">
      {/* Soft red glow accent — top-left */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#dc2626]/15 blur-[100px] pointer-events-none" />
      {/* Grain */}
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <Reveal className="lg:col-span-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e8b473] mb-6 flex items-center gap-3">
              <span className="w-10 h-px bg-[#e8b473]" />
              {c.label}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight max-w-3xl mb-6">
              {c.title}
            </h2>
            <p className="text-white/70 text-base lg:text-lg max-w-2xl leading-relaxed">{c.desc}</p>
          </Reveal>

          <Reveal className="lg:col-span-4 flex flex-col gap-3 lg:items-end" delay={2}>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors no-underline w-full lg:w-auto shadow-lg shadow-[#dc2626]/40 animate-pulse-glow"
            >
              {c.btn_quote}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+355692075317"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-white/40 text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-white hover:text-[#0c0a09] transition-colors no-underline w-full lg:w-auto"
            >
              <Phone size={16} /> +355 69 207 5317
            </a>
            <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1">
              {lang === "sq" ? "E Hënë – E Shtunë · 8:00 – 18:00" : "Mon – Sat · 8am – 6pm"}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
