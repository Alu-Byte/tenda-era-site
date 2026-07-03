"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Phone, Sparkles } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { SiteImage } from "@/types";

interface Props {
  heroImages: SiteImage[];
}

export default function HomeHero({ heroImages }: Props) {
  const { lang, t } = useLang();
  const heroImage = heroImages[0] ?? null;

  const headline =
    lang === "sq"
      ? "Zgjedhja e duhur për shtëpinë dhe biznesin tuaj."
      : "The right choice for your home and business.";

  const sub =
    lang === "sq"
      ? "Prodhues i tendave dhe çadrave premium që nga viti 1994 — montim profesional në të gjithë Shqipërinë."
      : "Premium awning and umbrella producer since 1994 — professional installation across Albania.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {heroImage ? (
          <>
            <Image
              src={heroImage.url}
              alt="Tenda Era"
              fill
              className="object-cover scale-105"
              priority
              sizes="100vw"
            />
            {/* Modern layered gradient — cleaner, lighter */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/75" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e11d3c]/20 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a12] via-[#661225] to-[#e11d3c]" />
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }} />
          </>
        )}
      </div>

      {/* Soft accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-30 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #e11d3c 0%, #f43f5e 50%, #e11d3c 100%)" }} />

      {/* Bottom smooth curve */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-24 block">
          <path d="M0,64 C240,120 480,10 720,50 C960,90 1200,20 1440,60 L1440,120 L0,120 Z" fill="#fbfaf6" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col lg:flex-row items-center gap-14">

        {/* Left */}
        <div className="flex-1 text-white text-center lg:text-left animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full pl-2 pr-4 py-1.5 text-sm text-white/90 font-medium mb-8">
            <span className="inline-flex items-center gap-1 bg-[#e11d3c] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
              <Sparkles size={10} strokeWidth={2.5} /> 1994
            </span>
            <span className="text-white/80">{t.hero.badge.replace("Themeluar 1994 · ", "").replace("Established 1994 · ", "")}</span>
          </div>

          <h1 className="font-display text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold leading-[1.05] mb-6 tracking-tight">
            {headline}
          </h1>

          <p className="text-white/80 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
            {sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-7 py-4 bg-[#e11d3c] text-white font-semibold rounded-full hover:bg-[#b91429] transition-all touch-manipulation shadow-[0_10px_30px_-8px_rgba(225,29,60,0.6)] hover:shadow-[0_14px_40px_-8px_rgba(225,29,60,0.7)] hover:-translate-y-0.5 no-underline"
            >
              {t.hero.cta_products}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 hover:border-white/50 transition-all touch-manipulation no-underline"
            >
              <Phone size={16} /> {t.hero.card_btn}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center gap-5 justify-center lg:justify-start text-white/60 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {lang === "sq" ? "Konsultim falas" : "Free consultation"}
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {lang === "sq" ? "Garanci prodhuesi" : "Manufacturer warranty"}
            </div>
          </div>
        </div>

        {/* Right: floating info card */}
        <div className="flex-shrink-0 hidden lg:block animate-fade-up delay-200">
          <div className="w-72 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-3xl p-7 text-white shadow-2xl relative overflow-hidden">
            {/* subtle inner glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#e11d3c]/25 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e11d3c] to-[#b91429] flex items-center justify-center mb-5 shadow-lg shadow-[#e11d3c]/40">
                <Sparkles size={22} className="text-white" strokeWidth={2.2} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 tracking-tight">{t.hero.card_title}</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">{t.hero.card_desc}</p>
              <Link
                href="/contact"
                className="block w-full py-3 bg-white text-neutral-900 text-sm font-semibold rounded-xl text-center hover:bg-white/95 transition-colors touch-manipulation no-underline"
              >
                {t.hero.card_btn} →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 text-white/50 pointer-events-none animate-bounce hidden md:block">
        <ChevronDown size={22} />
      </div>
    </section>
  );
}
