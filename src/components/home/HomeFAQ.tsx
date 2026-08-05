"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

  const visible = showAll ? items : items.slice(0, INITIAL_SHOW);
  const hidden = items.length - INITIAL_SHOW;

  return (
    <section className="bg-[#fbfaf6] py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 text-[#e11d3c] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <span className="w-6 h-px bg-[#e11d3c]" />
            {f.label}
            <span className="w-6 h-px bg-[#e11d3c]" />
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 leading-[1.1] tracking-tight">{f.title}</h2>
        </div>

        <div className="space-y-3">
          {visible.map((item, i) => {
            const isOpen = open === i;
            const q = lang === "sq" ? item.q_sq : item.q_en;
            const a = lang === "sq" ? item.a_sq : item.a_en;
            return (
              <div
                key={item.id}
                className={`rounded-2xl overflow-hidden bg-white border transition-all ${
                  isOpen
                    ? "border-[#e11d3c]/25 shadow-soft"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 lg:px-7 py-5 text-left touch-manipulation"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-neutral-900 text-base lg:text-[17px] tracking-tight leading-snug">{q}</span>
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isOpen ? "bg-[#e11d3c] text-white rotate-45" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    <Plus size={16} strokeWidth={2.5} />
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 lg:px-7 pb-6 text-neutral-600 leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length > INITIAL_SHOW && (
          <div className="mt-6 text-center">
            <button
              onClick={() => { setShowAll(!showAll); if (showAll) setOpen(null); }}
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 bg-white rounded-full text-sm font-semibold text-neutral-800 hover:border-[#e11d3c] hover:text-[#e11d3c] transition-colors touch-manipulation"
            >
              {showAll
                ? (lang === "sq" ? "Shfaq më pak" : "Show less")
                : (lang === "sq" ? `Shfaq edhe ${hidden} të tjera` : `Show ${hidden} more`)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
