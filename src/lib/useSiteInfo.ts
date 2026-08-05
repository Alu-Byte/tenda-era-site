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

// Short TTL so admin changes (hours, announcement) propagate to all pages
// within a few seconds without needing a full browser reload.
const CACHE_TTL_MS = 5_000;
let cache: SiteInfo | null = null;
let cacheAt = 0;
let inflight: Promise<SiteInfo> | null = null;

function isFresh() {
  return cache !== null && Date.now() - cacheAt < CACHE_TTL_MS;
}

export function useSiteInfo(): SiteInfo {
  const [info, setInfo] = useState<SiteInfo>(() => cache ?? DEFAULT);

  useEffect(() => {
    if (isFresh()) { setInfo(cache!); return; }
    if (!inflight) {
      inflight = fetch("/api/site/info", { cache: "no-store" })
        .then((r) => r.json())
        .then((data: SiteInfo) => { cache = data; cacheAt = Date.now(); inflight = null; return data; })
        .catch(() => { inflight = null; return DEFAULT; });
    }
    inflight.then(setInfo);
  }, []);

  return info;
}

export function invalidateSiteInfoCache() {
  cache = null;
  cacheAt = 0;
  inflight = null;
}
