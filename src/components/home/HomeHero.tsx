"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
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
      ? "Zgjedhja e duhur për shtëpinë dhe biznesin tuaj!"
      : "The right choice for your home and business!";

  const sub =
    lang === "sq"
      ? "Prodhues i tendave dhe çadrajave premium që nga viti 1994 — montim profesional në të gjithë Shqipërinë."
      : "Premium awning and umbrella producer since 1994 — professional installation across Albania.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background — pointer-events-none, never blocks taps */}
      <div className="absolute inset-0 pointer-events-none">
        {heroImage ? (
          <>
            <Image
              src={heroImage.url}
              alt="Tenda Era"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Dark gradient overlay — heavier at bottom for wave */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            {/* Red gradient accent */}
            <div className="absolute inset-0 bg-[#c0231e]/25" />
          </>
        ) : (
          <>
            {/* Fallback — brand red gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#6b1010] to-[#c0231e]" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
              backgroundSize: "30px 30px",
            }} />
          </>
        )}
      </div>

      {/* Red accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#c0231e] z-30 pointer-events-none" />

      {/* Bottom wave — pointer-events-none */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#faf8f4] z-10 pointer-events-none"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 35%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#faf8f4] z-10 pointer-events-none"
        style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)" }} />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 pt-28 pb-44 flex flex-col lg:flex-row items-center gap-14">

        {/* Left: text */}
        <div className="flex-1 text-white text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c0231e] animate-pulse shrink-0" />
            {t.hero.badge}
          </div>

          {/* Main headline — single static */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
            {headline}
          </h1>

          <p className="text-white/75 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
            {sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#c0231e] text-white font-semibold rounded-full hover:bg-[#9a1c18] active:bg-[#9a1c18] transition-colors touch-manipulation shadow-lg"
            >
              {t.hero.cta_products} <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white/15 backdrop-blur-sm border border-white/40 text-white font-semibold rounded-full hover:bg-white/25 active:bg-white/25 transition-colors touch-manipulation"
            >
              <Phone size={16} /> {t.hero.card_btn}
            </Link>
          </div>
        </div>

        {/* Right: info card — desktop only */}
        <div className="flex-shrink-0 hidden lg:block">
          <div className="w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-white">
            <div className="w-14 h-14 rounded-2xl bg-[#c0231e]/30 border border-[#c0231e]/50 flex items-center justify-center mb-5">
              <span className="text-white text-2xl">☀</span>
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">{t.hero.card_title}</h3>
            <p className="text-white/60 text-sm mb-6">{t.hero.card_desc}</p>
            <Link
              href="/contact"
              className="block w-full py-3 bg-[#c0231e] text-white text-sm font-semibold rounded-xl text-center hover:bg-[#9a1c18] active:bg-[#9a1c18] transition-colors touch-manipulation"
            >
              {t.hero.card_btn}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-white/40 pointer-events-none animate-bounce">
        <ChevronDown size={22} />
      </div>
    </section>
  );
}
