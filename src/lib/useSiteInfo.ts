"use client";
import { useState, useEffect } from "react";
import type { OpeningHours, Announcement } from "@/types";

export interface SiteInfo {
  openingHours: OpeningHours;
  announcement: Announcement;
}

const DEFAULT: SiteInfo = {
  openingHours: {
    weekdays_sq: "E Hënë – E Premte, 8:00 – 18:00",
    weekdays_en: "Monday – Friday, 8:00 AM – 6:00 PM",
    saturday_sq: "E Shtunë, 8:00 – 14:00",
    saturday_en: "Saturday, 8:00 AM – 2:00 PM",
  },
  announcement: { text_sq: "", text_en: "", active: false, bg: "red" },
};

let cache: SiteInfo | null = null;
let inflight: Promise<SiteInfo> | null = null;

export function useSiteInfo(): SiteInfo {
  const [info, setInfo] = useState<SiteInfo>(() => cache ?? DEFAULT);

  useEffect(() => {
    if (cache) { setInfo(cache); return; }
    if (!inflight) {
      inflight = fetch("/api/site/info")
        .then((r) => r.json())
        .then((data: SiteInfo) => { cache = data; return data; })
        .catch(() => DEFAULT);
    }
    inflight.then(setInfo);
  }, []);

  return info;
}

export function invalidateSiteInfoCache() {
  cache = null;
  inflight = null;
}
