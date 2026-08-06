"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { SiteImage } from "@/types";

interface Props {
  images: SiteImage[];
}

export default function HomePortfolioPreview({ images }: Props) {
  const { t } = useLang();
  const ps = t.portfolio_section;

  // Show up to 6 preview photos on the home page.
  const items = images.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#faf7f2] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Head */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b91c1c]">
              02 · {ps.label}
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1917] leading-[1.1] tracking-tight">
              {ps.title}
            </h2>
          </div>
          <div className="lg:col-span-3 flex lg:justify-end lg:items-end">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[#b91c1c] hover:text-[#991b1b] transition-colors no-underline"
            >
              {ps.see_all}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Natural-aspect masonry — photos never cropped. Same treatment as /portfolio. */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5 [&>*]:mb-4 lg:[&>*]:mb-5">
          {items.map((img) => (
            <Link
              key={img.id}
              href="/portfolio"
              className="break-inside-avoid rounded-2xl lg:rounded-3xl overflow-hidden relative group cursor-pointer shadow-soft hover:shadow-elevated transition-shadow ring-1 ring-[#e3ddd1] block no-underline"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                loading="lazy"
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#b91c1c]/0 via-transparent to-transparent group-hover:from-[#b91c1c]/25 transition-colors duration-300" />
            </Link>
          ))}
        </div>

        {/* Bottom CTA to full portfolio */}
        <div className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#b91c1c] text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors no-underline shadow-lg shadow-[#b91c1c]/25"
          >
            {ps.see_all}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
