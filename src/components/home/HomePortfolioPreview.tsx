"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { SiteImage } from "@/types";
import Reveal from "@/components/Reveal";

interface Props {
  images: SiteImage[];
}

export default function HomePortfolioPreview({ images }: Props) {
  const { t } = useLang();
  const ps = t.portfolio_section;

  const items = images.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#faf7f2] py-24 lg:py-32 relative overflow-hidden">
      {/* Red gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#dc2626] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
            <div className="lg:col-span-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dc2626] flex items-center gap-3">
                <span className="w-8 h-px bg-[#dc2626]" />
                02 · {ps.label}
              </p>
            </div>
            <div className="lg:col-span-9">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1917] leading-[1.1] tracking-tight max-w-3xl">
                {ps.title}
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Uniform 3-col landscape grid — clean, magazine-style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((img, i) => (
            <Reveal key={img.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Link
                href="/portfolio"
                className="group relative overflow-hidden rounded-2xl lg:rounded-3xl block no-underline shadow-soft hover:shadow-elevated transition-all duration-500 ring-1 ring-[#e3ddd1] bg-[#f2ede4]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={88}
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                  />
                  {/* Red-tinted overlay on hover */}
                  <div className="absolute inset-0 bg-[#dc2626]/0 group-hover:bg-[#dc2626]/20 transition-colors duration-500" />
                  {/* Slide-up bottom bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#dc2626] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                  {/* Rotating arrow badge */}
                  <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                    <ArrowUpRight size={17} className="text-[#dc2626] transition-transform duration-500 group-hover:rotate-45" strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal>
          <div className="mt-14 text-center">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors no-underline shadow-lg shadow-[#dc2626]/30 animate-pulse-glow"
            >
              {ps.see_all}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
