"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSiteInfo } from "@/lib/useSiteInfo";
import { useLang } from "@/lib/LangContext";

const STORAGE_KEY = "announcement_dismissed";

const BG: Record<string, string> = {
  red: "bg-[#c0231e] text-white",
  dark: "bg-[#1a1a1a] text-white",
  yellow: "bg-amber-400 text-[#1a1a1a]",
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
    <div className={`relative z-50 w-full py-2.5 px-4 text-center text-sm font-semibold ${bg}`}>
      {announcement.link ? (
        <a href={announcement.link} className="hover:underline underline-offset-2">{text}</a>
      ) : (
        <span>{text}</span>
      )}
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1"
        aria-label="Mbyll"
      >
        <X size={15} />
      </button>
    </div>
  );
}
