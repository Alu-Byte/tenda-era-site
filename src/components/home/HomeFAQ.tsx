"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { FaqItem } from "@/types";

const INITIAL_SHOW = 5;

interface Props {
  items: FaqItem[];
}

export default function HomeFAQ({ items }: Props) {
  const { lang, t } = useLang();
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (items.length === 0) return null;

  const visible = showAll ? items : items.slice(0, INITIAL_SHOW);
  const hidden = items.length - INITIAL_SHOW;

  return (
    <section className="bg-[#faf7f2] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#0d5c63] mb-4">
              04 · {f.label}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1917] leading-[1.1] tracking-tight">
              {f.title}
            </h2>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-[#e3ddd1] border-y border-[#e3ddd1]">
              {visible.map((item, i) => {
                const isOpen = open === i;
                const q = lang === "sq" ? item.q_sq : item.q_en;
                const a = lang === "sq" ? item.a_sq : item.a_en;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 py-6 text-left touch-manipulation"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-[#1c1917] text-base lg:text-lg leading-snug">{q}</span>
                      <span className="shrink-0 w-8 h-8 border border-[#e3ddd1] flex items-center justify-center text-[#0d5c63]">
                        {isOpen ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                      </span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="pb-6 pr-14 text-[#57534e] leading-relaxed">{a}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {items.length > INITIAL_SHOW && (
              <div className="mt-6">
                <button
                  onClick={() => { setShowAll(!showAll); if (showAll) setOpen(null); }}
                  className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[#0d5c63] hover:text-[#0a4a50] transition-colors touch-manipulation"
                >
                  {showAll
                    ? (lang === "sq" ? "Shfaq më pak" : "Show less")
                    : (lang === "sq" ? `Shfaq edhe ${hidden} të tjera` : `Show ${hidden} more`)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
