"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, ArrowDown } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { SiteImage } from "@/types";

interface Props {
  heroImages: SiteImage[];
}

/** Animated integer count-up. Starts when the element enters viewport. */
function CountUp({ target, suffix = "", duration = 1400 }: { target: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // Intentional: skip the count-up animation and jump to final value.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }
    const run = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } }),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

export default function HomeHero({ heroImages }: Props) {
  const { lang, t } = useLang();
  const heroImage = heroImages[0] ?? null;

  const eyebrow = lang === "sq" ? "Tenda dhe çadra që nga 1994" : "Awnings and parasols since 1994";
  const headline = lang === "sq"
    ? "Hijeje profesionale për bare, restorante dhe plazhe."
    : "Professional shade for cafés, restaurants and beaches.";
  const sub = lang === "sq"
    ? "Prodhojmë, montojmë dhe mirëmbajmë sisteme tendash dhe çadrash me pëlhura teknike gjermane dhe italiane në të gjithë Shqipërinë."
    : "We produce, install and service awning and parasol systems with German and Italian technical fabrics across Albania.";

  const headlineWords = headline.split(" ");

  return (
    <section className="relative min-h-[80vh] md:min-h-[92vh] flex items-end overflow-hidden bg-[#0c0a09]">
      {/* Background photo with slow Ken Burns pan/zoom */}
      <div className="absolute inset-0">
        {heroImage ? (
          <div className="absolute inset-0 animate-ken-burns will-change-transform">
            <Image
              src={heroImage.url}
              alt=""
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0a09] via-[#1c1917] to-[#292524]" />
        )}
        {/* Dark scrim — bottom-heavy so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
        {/* Subtle grain for premium feel */}
        <div className="absolute inset-0 grain" />
      </div>

      {/* Red gradient accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-30 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, #dc2626 40%, #dc2626 60%, transparent 100%)" }} />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-10 pt-40 pb-20 lg:pb-28 text-white z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6 animate-fade-up">
          <span className="w-10 h-px bg-[#fca5a5] animate-draw-line origin-left" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#fca5a5]">{eyebrow}</span>
        </div>

        {/* Headline — each word fades up with a stagger */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.02] tracking-tight max-w-4xl mb-6 [perspective:800px]">
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden pb-[0.05em] pr-[0.25em] align-baseline"
            >
              <span
                className="inline-block animate-word-up"
                style={{ animationDelay: `${0.15 + i * 0.06}s` }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p className="text-white/75 text-base sm:text-lg max-w-2xl leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: "0.6s", opacity: 0, animationFillMode: "forwards" }}>
          {sub}
        </p>

        <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.75s", opacity: 0, animationFillMode: "forwards" }}>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 pl-6 pr-5 py-3.5 bg-[#dc2626] text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors no-underline shadow-lg shadow-[#dc2626]/30 relative"
          >
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white/60 animate-soft-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
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
        <div className="mt-14 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs animate-fade-up" style={{ animationDelay: "0.9s", opacity: 0, animationFillMode: "forwards" }}>
          <TrustItem k={lang === "sq" ? "Vjet Eksperiencë" : "Years Experience"} target={30} suffix="+" />
          <TrustItem k={lang === "sq" ? "Instalime" : "Installations"} target={500} suffix="+" />
          <TrustItem k={lang === "sq" ? "Qytete" : "Cities"} target={12} />
          <TrustItem k={lang === "sq" ? "Garanci" : "Warranty"} literal={`5–10 ${lang === "sq" ? "vjet" : "yrs"}`} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-white/50 pointer-events-none">
        <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
        <ArrowDown size={18} className="animate-float" />
      </div>
    </section>
  );
}

function TrustItem({ k, target, suffix, literal }: { k: string; target?: number; suffix?: string; literal?: string }) {
  return (
    <div>
      <p className="text-[#fca5a5] text-2xl lg:text-3xl font-bold tabular-nums tracking-tight">
        {literal ?? (target !== undefined && <CountUp target={target} suffix={suffix ?? ""} />)}
      </p>
      <p className="text-white/55 uppercase tracking-widest text-[10px] mt-1">{k}</p>
    </div>
  );
}
