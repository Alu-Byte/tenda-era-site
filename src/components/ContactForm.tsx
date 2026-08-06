"use client";

import { useState } from "react";
import { Send, CheckCircle, ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";

const productOptionsSQ = ["Tendë Tërheqëse", "Tendë Fikse", "Çadër e Madhe", "Kanope / Pergolë", "Aksesorë / Pjesë", "Tjetër / Nuk jam i sigurt"];
const productOptionsEN = ["Retractable Awning", "Fixed Awning", "Large Parasol", "Canopy / Pergola", "Accessories / Parts", "Other / Not sure"];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lang, t } = useLang();
  const c = t.contact_page;

  const productOptions = lang === "sq" ? productOptionsSQ : productOptionsEN;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-white rounded-3xl p-10 lg:p-12 border border-[#e3ddd1] shadow-elevated flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-600" strokeWidth={2.2} />
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-[#1c1917] tracking-tight leading-tight">
          {c.sent_title}
        </h3>
        <p className="text-[#57534e] max-w-sm leading-relaxed">{c.sent_desc}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 border border-[#e3ddd1] rounded-full text-xs font-bold uppercase tracking-wider text-[#1c1917] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors touch-manipulation"
        >
          {c.send_another}
          <ArrowUpRight size={13} />
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#e3ddd1] bg-[#faf7f2] focus:bg-white focus:border-[#dc2626] focus:ring-4 focus:ring-[#dc2626]/10 focus:outline-none text-[#1c1917] text-sm transition-all placeholder:text-[#a8a29e]";
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.18em] text-[#57534e] mb-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#e3ddd1] shadow-elevated space-y-5"
    >
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">02</span>
          <span className="w-10 h-px bg-[#dc2626]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
            {c.form_title}
          </span>
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-[#1c1917] tracking-tight leading-tight">
          {lang === "sq" ? "Na tregoni për projektin" : "Tell us about your project"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{c.first_name} *</label>
          <input type="text" required className={inputClass} placeholder={lang === "sq" ? "Emri" : "John"} />
        </div>
        <div>
          <label className={labelClass}>{c.last_name} *</label>
          <input type="text" required className={inputClass} placeholder={lang === "sq" ? "Mbiemri" : "Doe"} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email *</label>
        <input type="email" required className={inputClass} placeholder="you@example.com" />
      </div>

      <div>
        <label className={labelClass}>{c.phone}</label>
        <input type="tel" className={inputClass} placeholder="+355 ..." />
      </div>

      <div>
        <label className={labelClass}>{c.product_label}</label>
        <select className={inputClass}>
          <option value="">{lang === "sq" ? "Zgjidhni produktin..." : "Select a product..."}</option>
          {productOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>{c.message_label} *</label>
        <textarea required rows={5} className={`${inputClass} resize-none`} placeholder={c.message_placeholder} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group w-full py-4 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation shadow-lg shadow-[#dc2626]/40"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {c.send}
            <Send size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
