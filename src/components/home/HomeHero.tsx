"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { SiteImage } from "@/types";

interface Props {
  heroImages: SiteImage[];
}

export default function HomeHero({ heroImages }: Props) {
  const { lang, t } = useLang();
  const heroImage = heroImages[0] ?? null;

  const eyebrow = lang === "sq" ? "Tenda dhe çadra që nga 1994" : "Awnings and umbrellas since 1994";
  const headline = lang === "sq"
    ? "Hijeje profesionale për bare, restorante dhe plazhe."
    : "Professional shade for cafés, restaurants and beaches.";
  const sub = lang === "sq"
    ? "Prodhojmë, montojmë dhe mirëmbajmë sisteme tendash dhe çadrash me pëlhura teknike gjermane dhe italiane në të gjithë Shqipërinë."
    : "We produce, install and service awning and umbrella systems with German and Italian technical fabrics across Albania.";

  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-[#0c0a09]">
      {/* Background photo */}
      <div className="absolute inset-0">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0a09] via-[#1c1917] to-[#292524]" />
        )}
        {/* Dark scrim — bottom-heavy so text at the bottom stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-10 pt-40 pb-20 lg:pb-28 text-white">
        {/* Eyebrow with vertical tick */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-px bg-[#e8b473]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e8b473]">{eyebrow}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.02] tracking-tight max-w-4xl mb-6">
          {headline}
        </h1>

        <p className="text-white/75 text-base sm:text-lg max-w-2xl leading-relaxed mb-10">
          {sub}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 pl-6 pr-5 py-3.5 bg-[#c86b3c] text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-[#a54f24] transition-colors no-underline shadow-lg shadow-[#c86b3c]/30"
          >
            <Phone size={15} /> {t.hero.card_btn}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/40 text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-white hover:text-[#0c0a09] transition-colors no-underline"
          >
            {t.hero.cta_products}
          </Link>
        </div>

        {/* Trust strip pinned bottom */}
        <div className="mt-14 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs">
          <TrustItem
            k={lang === "sq" ? "Vjet Eksperiencë" : "Years Experience"}
            v="30+"
          />
          <TrustItem
            k={lang === "sq" ? "Instalime" : "Installations"}
            v="500+"
          />
          <TrustItem
            k={lang === "sq" ? "Qytete" : "Cities"}
            v="12"
          />
          <TrustItem
            k={lang === "sq" ? "Garanci" : "Warranty"}
            v={`5–10 ${lang === "sq" ? "vjet" : "yrs"}`}
          />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[#e8b473] text-2xl lg:text-3xl font-bold tabular-nums tracking-tight">{v}</p>
      <p className="text-white/55 uppercase tracking-widest text-[10px] mt-1">{k}</p>
    </div>
  );
}
