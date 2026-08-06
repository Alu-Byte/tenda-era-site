"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Package, LayoutGrid } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { Category, Subcategory } from "@/types";
import Reveal from "@/components/Reveal";

interface Props {
  categories: Category[];
  subcategories: Subcategory[];
}

export default function HomeProducts({ categories, subcategories }: Props) {
  const { lang, t } = useLang();
  const ps = t.products_section;

  const orderedCats = [...categories].sort((a, b) => a.order - b.order);

  return (
    <section className="relative bg-[#faf7f2] py-24 lg:py-32 overflow-hidden">
      {/* Subtle decorative accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e3ddd1] to-transparent" />
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#dc2626]/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#dc2626]/[0.03] blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 lg:mb-16 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">01</span>
                <span className="w-10 h-px bg-[#dc2626]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dc2626]">
                  {ps.label}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1c1917] leading-[1.02] tracking-tight max-w-3xl">
                {ps.title}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#e3ddd1] rounded-full text-xs font-bold uppercase tracking-wider text-[#1c1917] hover:border-[#dc2626] hover:text-[#dc2626] hover:shadow-soft transition-all no-underline"
              >
                {lang === "sq" ? "Të gjitha produktet" : "View all products"}
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Category showcase cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {orderedCats.map((cat, i) => {
            const subs = subcategories
              .filter((s) => s.categoryId === cat.id)
              .sort((a, b) => a.order - b.order);
            const catName = lang === "sq" ? cat.name_sq : cat.name_en;

            return (
              <Reveal key={cat.id} delay={(i + 1) as 1 | 2}>
                <Link
                  href={`/products#${cat.id}`}
                  className="group relative overflow-hidden rounded-3xl no-underline block h-[380px] sm:h-[440px] lg:h-[500px] shadow-soft hover:shadow-elevated transition-all duration-500 ring-1 ring-[#e3ddd1]"
                >
                  {/* Background — photo or rich fallback */}
                  {cat.coverImage ? (
                    <Image
                      src={cat.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={90}
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                      style={{ objectPosition: cat.coverPosition ?? "50% 50%" }}
                    />
                  ) : (
                    <CategoryPatternBg />
                  )}

                  {/* Legibility gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
                  {/* Red hover wash */}
                  <div className="absolute inset-0 bg-[#dc2626]/0 group-hover:bg-[#dc2626]/15 transition-colors duration-500" />

                  {/* Top row: category number + stats */}
                  <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-white z-10">
                    <span className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.24em]">
                      <span className="text-[#fca5a5] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="w-4 h-px bg-white/40" />
                      {lang === "sq" ? "Kategoria" : "Category"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-[11px] font-bold tabular-nums">
                      <LayoutGrid size={11} />
                      {subs.length}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-9 text-white z-10">
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.02] transition-transform duration-500 group-hover:-translate-y-1">
                        {catName}
                      </h3>
                      <div className="w-12 h-12 rounded-full bg-[#dc2626] flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 shrink-0 shadow-lg shadow-[#dc2626]/50">
                        <ArrowUpRight size={18} className="text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* Corner accent — draws in on hover */}
                  <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[2px] h-8 bg-[#dc2626] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />
                    <div className="absolute top-0 right-0 h-[2px] w-8 bg-[#dc2626] scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500" />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Rich patterned fallback background for category cards without a cover photo. */
function CategoryPatternBg() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#3a0f0f] via-[#180808] to-[#22090a] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 400px at 70% -10%, rgba(220,38,38,0.4), transparent 60%), radial-gradient(500px 300px at 10% 110%, rgba(153,27,27,0.4), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 20px)",
        }}
      />
      {/* Sun/awning ring motif */}
      <svg
        className="absolute -right-24 -bottom-24 w-[420px] h-[420px] text-white/[0.06] pointer-events-none"
        viewBox="0 0 420 420"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="210" cy="210" r="70" stroke="currentColor" strokeWidth="1" />
        <circle cx="210" cy="210" r="120" stroke="currentColor" strokeWidth="1" />
        <circle cx="210" cy="210" r="170" stroke="currentColor" strokeWidth="1" />
        <circle cx="210" cy="210" r="210" stroke="currentColor" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="210"
            y1="210"
            x2={210 + 210 * Math.cos((i * Math.PI) / 6)}
            y2={210 + 210 * Math.sin((i * Math.PI) / 6)}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>
      <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-[#dc2626]/35 blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full bg-[#991b1b]/40 blur-[90px]" />
      <div className="absolute inset-0 grain" />
      {/* Centered icon mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center">
          <Package size={30} className="text-[#fca5a5]" strokeWidth={1.6} />
        </div>
      </div>
    </div>
  );
}
