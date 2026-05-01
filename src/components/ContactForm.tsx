"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useLang } from "@/lib/LangContext";

const productOptionsSQ = ["Tendë Tërheqëse", "Tendë Fikse", "Çadër e Madhe", "Kanopi / Pergolë", "Aksesore / Pjesë", "Tjetër / Nuk jam i sigurt"];
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
      <div className="bg-white rounded-3xl p-12 border border-[#e5e5e5] flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-[#1a1a1a]">{c.sent_title}</h3>
        <p className="text-[#2d2d2d]/60 max-w-sm">{c.sent_desc}</p>
        <button onClick={() => setSent(false)} className="mt-4 px-6 py-3 border border-[#e5e5e5] rounded-full text-sm font-medium text-[#1a1a1a] hover:border-[#c0231e] transition-colors touch-manipulation">
          {c.send_another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-[#e5e5e5] space-y-5">
      <h3 className="font-display text-2xl font-bold text-[#1a1a1a] mb-2">{c.form_title}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2d2d]/50 mb-2">{c.first_name} *</label>
          <input type="text" required className="w-full px-4 py-3 rounded-xl border border-[#e5e5e5] focus:border-[#c0231e] focus:outline-none text-[#1a1a1a] text-sm transition-colors" placeholder={lang === "sq" ? "Emri" : "John"} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2d2d]/50 mb-2">{c.last_name} *</label>
          <input type="text" required className="w-full px-4 py-3 rounded-xl border border-[#e5e5e5] focus:border-[#c0231e] focus:outline-none text-[#1a1a1a] text-sm transition-colors" placeholder={lang === "sq" ? "Mbiemri" : "Doe"} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2d2d]/50 mb-2">Email *</label>
        <input type="email" required className="w-full px-4 py-3 rounded-xl border border-[#e5e5e5] focus:border-[#c0231e] focus:outline-none text-[#1a1a1a] text-sm transition-colors" placeholder="you@example.com" />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2d2d]/50 mb-2">{c.phone}</label>
        <input type="tel" className="w-full px-4 py-3 rounded-xl border border-[#e5e5e5] focus:border-[#c0231e] focus:outline-none text-[#1a1a1a] text-sm transition-colors" placeholder="+355 ..." />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2d2d]/50 mb-2">{c.product_label}</label>
        <select className="w-full px-4 py-3 rounded-xl border border-[#e5e5e5] focus:border-[#c0231e] focus:outline-none text-[#1a1a1a] text-sm transition-colors bg-white">
          <option value="">{lang === "sq" ? "Zgjidhni produktin..." : "Select a product..."}</option>
          {productOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#2d2d2d]/50 mb-2">{c.message_label} *</label>
        <textarea required rows={5} className="w-full px-4 py-3 rounded-xl border border-[#e5e5e5] focus:border-[#c0231e] focus:outline-none text-[#1a1a1a] text-sm transition-colors resize-none" placeholder={c.message_placeholder} />
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 bg-[#c0231e] text-white font-semibold rounded-xl hover:bg-[#9a1c18] active:bg-[#9a1c18] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 touch-manipulation">
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>{c.send} <Send size={16} /></>
        )}
      </button>
    </form>
  );
}
