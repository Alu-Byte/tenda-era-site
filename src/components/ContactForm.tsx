"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useLang } from "@/lib/LangContext";

const productOptionsSQ = ["Tendë Tërheqëse", "Tendë Fikse", "Çadër e Madhe", "Kanope / Pergolë", "Aksesorë / Pjesë", "Tjetër / Nuk jam i sigurt"];
const productOptionsEN = ["Retractable Awning", "Fixed Awning", "Large Umbrella", "Canopy / Pergola", "Accessories / Parts", "Other / Not sure"];

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
      <div className="bg-white rounded-3xl p-12 border border-neutral-200 shadow-soft flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-600" strokeWidth={2.2} />
        </div>
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">{c.sent_title}</h3>
        <p className="text-neutral-500 max-w-sm leading-relaxed">{c.sent_desc}</p>
        <button onClick={() => setSent(false)} className="mt-4 px-6 py-3 border border-neutral-200 rounded-full text-sm font-medium text-neutral-800 hover:border-[#dc2626] hover:text-[#dc2626] transition-colors touch-manipulation">
          {c.send_another}
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:border-[#dc2626] focus:ring-4 focus:ring-[#dc2626]/10 focus:outline-none text-neutral-900 text-sm transition-all placeholder:text-neutral-400";
  const labelClass = "block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-soft space-y-5">
      <h3 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">{c.form_title}</h3>

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

      <button type="submit" disabled={loading} className="w-full py-4 bg-[#dc2626] text-white font-semibold rounded-xl hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 disabled:opacity-60 touch-manipulation shadow-[0_10px_24px_-8px_rgba(220,38,38,0.5)] hover:-translate-y-0.5">
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>{c.send} <Send size={16} /></>
        )}
      </button>
    </form>
  );
}
