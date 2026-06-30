"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import type { FaqItem } from "@/types";

const INITIAL_SHOW = 3;

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
    <section className="bg-[#faf8f4] py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{f.label}</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">{f.title}</h2>
        </div>

        <div className="space-y-3">
          {visible.map((item, i) => {
            const isOpen = open === i;
            const q = lang === "sq" ? item.q_sq : item.q_en;
            const a = lang === "sq" ? item.a_sq : item.a_en;
            return (
              <div key={item.id} className="border border-[#1a1a1a]/10 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[#1a1a1a] text-base lg:text-lg">{q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#c0231e] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-7 pb-6 text-[#1a1a1a]/65 leading-relaxed">{a}</p>
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
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a1a1a]/15 rounded-full text-sm font-semibold text-[#1a1a1a] hover:border-[#c0231e] hover:text-[#c0231e] transition-colors"
            >
              <ChevronDown size={16} className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
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
