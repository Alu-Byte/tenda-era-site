"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import Reveal from "@/components/Reveal";

function PhoneLine({ number, tel, label }: { number: string; tel: string; label: string }) {
  return (
    <a
      href={`tel:${tel}`}
      className="group inline-flex items-center gap-3 pl-4 pr-5 py-3 border border-white/40 text-white rounded-full hover:bg-white hover:text-[#0c0a09] transition-colors no-underline"
    >
      <span className="w-8 h-8 rounded-full bg-[#dc2626]/25 border border-[#dc2626]/50 flex items-center justify-center shrink-0 group-hover:bg-[#dc2626] group-hover:border-[#dc2626] transition-colors">
        <Phone size={13} className="text-white group-hover:text-white" />
      </span>
      <span className="flex flex-col leading-tight text-left flex-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fca5a5] group-hover:text-[#dc2626] transition-colors">
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums tracking-tight">
          +355 69 207 {number}
        </span>
      </span>
    </a>
  );
}

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
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#fca5a5] mb-6 flex items-center gap-3">
              <span className="w-10 h-px bg-[#fca5a5]" />
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
            <div className="w-full lg:w-auto flex flex-col gap-2">
              <PhoneLine number="5317" tel="+355692075317" label="Çadra" />
              <PhoneLine number="5318" tel="+355692075318" label="Çadra" />
              <PhoneLine number="5319" tel="+355692075319" label="Tenda" />
            </div>
            <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1">
              {lang === "sq"
                ? "E Hën–Pre · 8:00–16:00  ·  E Sht · 8:00–14:00"
                : "Mon–Fri · 8am–4pm  ·  Sat · 8am–2pm"}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
