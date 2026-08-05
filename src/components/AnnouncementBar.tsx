"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSiteInfo } from "@/lib/useSiteInfo";
import { useLang } from "@/lib/LangContext";

const STORAGE_KEY = "announcement_dismissed";

const BG: Record<string, string> = {
  red: "bg-gradient-to-r from-[#0d5c63] to-[#4a9d95] text-white",
  dark: "bg-gradient-to-r from-neutral-950 to-neutral-800 text-white",
  yellow: "bg-gradient-to-r from-amber-400 to-amber-300 text-neutral-900",
};

export default function AnnouncementBar() {
  const { announcement } = useSiteInfo();
  const { lang } = useLang();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const text = lang === "sq" ? announcement.text_sq : announcement.text_en;
    if (stored !== text) setDismissed(false);
  }, [announcement, lang]);

  if (!announcement.active) return null;
  const text = lang === "sq" ? announcement.text_sq : announcement.text_en;
  if (!text || dismissed) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, text);
    setDismissed(true);
  }

  const bg = BG[announcement.bg] ?? BG.red;

  return (
    <div className={`relative z-50 w-full py-2.5 px-4 text-center text-sm font-medium ${bg}`}>
      {announcement.link ? (
        <a href={announcement.link} className="hover:underline underline-offset-4">{text}</a>
      ) : (
        <span>{text}</span>
      )}
      <button
        onClick={dismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-white/15 transition-all"
        aria-label="Mbyll"
      >
        <X size={14} />
      </button>
    </div>
  );
}
