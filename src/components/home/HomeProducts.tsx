"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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

  return (
    <section className="bg-[#faf7f2] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
            <div className="lg:col-span-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dc2626] flex items-center gap-3">
                <span className="w-8 h-px bg-[#dc2626]" />
                01 · {ps.label}
              </p>
            </div>
            <div className="lg:col-span-9">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1917] leading-[1.1] tracking-tight max-w-3xl">
                {ps.title}
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {categories.map((cat, i) => {
            const subs = subcategories.filter((s) => s.categoryId === cat.id);
            return (
              <Reveal key={cat.id} delay={(i + 1) as 1 | 2}>
                <Link
                  href={`/products#${cat.id}`}
                  className="group relative overflow-hidden rounded-3xl no-underline block h-[440px] shadow-soft hover:shadow-elevated transition-all duration-500 ring-1 ring-[#e3ddd1]"
                >
                  {cat.coverImage ? (
                    <Image
                      src={cat.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={90}
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                      style={{ objectPosition: cat.coverPosition ?? "50% 50%" }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#292524] to-[#0c0a09]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#dc2626]/0 via-transparent to-transparent group-hover:from-[#dc2626]/30 transition-colors duration-500" />

                  <div className="absolute top-6 right-6 flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-6 h-px bg-white/40 transition-all duration-500 group-hover:w-10 group-hover:bg-white" />
                    {cat.id}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-9 text-white">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-2xl lg:text-3xl font-bold tracking-tight leading-tight transition-transform duration-500 group-hover:-translate-y-1">
                        {lang === "sq" ? cat.name_sq : cat.name_en}
                      </h3>
                      <div className="w-11 h-11 rounded-full bg-[#dc2626] flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 shrink-0 shadow-lg shadow-[#dc2626]/40">
                        <ArrowUpRight size={17} className="text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    {subs.length > 0 && (
                      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/85 transition-all duration-500 group-hover:text-white">
                        {subs.slice(0, 4).map((sub, idx) => (
                          <li key={sub.id} className="flex items-center gap-2">
                            {idx > 0 && <span className="w-1 h-1 rounded-full bg-white/40" />}
                            {lang === "sq" ? sub.name_sq : sub.name_en}
                          </li>
                        ))}
                      </ul>
                    )}
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
