"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { SiteImage } from "@/types";

interface Props {
  images: SiteImage[];
}

export default function HomePortfolioPreview({ images }: Props) {
  const { t } = useLang();
  const ps = t.portfolio_section;

  const items = images.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#faf9f6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Head */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#0f766e]">
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
              className="group inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[#1c1917] hover:text-[#0f766e] transition-colors no-underline"
            >
              {ps.see_all}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Tight grid, no captions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3">
          {items.map((img, i) => (
            <Link
              key={img.id}
              href="/portfolio"
              className={`relative overflow-hidden group no-underline ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:h-[520px]" : "aspect-square"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={88}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
