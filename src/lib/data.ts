import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";
import type { SiteData, SiteImage, Category, Subcategory, FaqItem, OpeningHours, Announcement } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data", "site-data.json");
const BLOB_KEY = "site-data.json";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "tenda", name_sq: "Tenda", name_en: "Awnings", icon: "▤", order: 1 },
  { id: "cadra", name_sq: "Çadra", name_en: "Umbrellas", icon: "⛱", order: 2 },
];

const DEFAULT_SUBCATEGORIES: Subcategory[] = [
  { id: "tenda-terhequese", categoryId: "tenda", name_sq: "Tendë Tërheqëse", name_en: "Retractable Awning", desc_sq: "Tenda që rrudhet dhe hapet me motor ose dorë.", desc_en: "Awning that retracts and extends with motor or manual crank.", order: 1 },
  { id: "tenda-fikse", categoryId: "tenda", name_sq: "Tendë Fikse", name_en: "Fixed Awning", desc_sq: "Tendë e montuar në mënyrë permanente mbi fasadë ose tarracë.", desc_en: "Permanently mounted awning over a facade or terrace.", order: 2 },
  { id: "cadra-plazhi", categoryId: "cadra", name_sq: "Çadër Plazhi", name_en: "Beach Umbrella", desc_sq: "Çadra të mëdha për plazhe dhe zona bregdetare.", desc_en: "Large umbrellas for beaches and coastal areas.", order: 1 },
  { id: "cadra-restoranti", categoryId: "cadra", name_sq: "Çadër Restoranti", name_en: "Restaurant Umbrella", desc_sq: "Çadra komerciale për restorante, bare dhe kafene.", desc_en: "Commercial umbrellas for restaurants, bars and cafes.", order: 2 },
];

const INITIAL_DATA: SiteData = {
  images: [],
  categories: DEFAULT_CATEGORIES,
  subcategories: DEFAULT_SUBCATEGORIES,
  faqs: [],
};

function isBlobStorage(): boolean {
  // Detects both classic (BLOB_READ_WRITE_TOKEN) and OIDC-based
  // (BLOB_STORE_ID + VERCEL_OIDC_TOKEN) Blob configurations.
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL)
  );
}

// ── In-memory cache (per serverless instance) ─────────────
// Blob-backed reads use a short TTL so writes from other Lambda instances
// (e.g. admin uploads) become visible without waiting for a cold start.
const BLOB_CACHE_TTL_MS = 3_000;
let cache: SiteData | null = null;
let cacheAt = 0;
let cachePromise: Promise<SiteData> | null = null;

function normalize(data: SiteData): SiteData {
  return {
    images: data.images ?? [],
    // Defaults are seeded only when the field is truly missing (fresh install).
    // Once the user manages the list — including deleting everything — respect it.
    categories: data.categories ?? DEFAULT_CATEGORIES,
    subcategories: data.subcategories ?? DEFAULT_SUBCATEGORIES,
    faqs: data.faqs ?? [],
    openingHours: data.openingHours,
    announcement: data.announcement,
  };
}

// ── Filesystem read (dev) ─────────────────────────────────
function readFromFile(): SiteData {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    return { ...INITIAL_DATA };
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return normalize(JSON.parse(raw) as SiteData);
}

function writeToFile(data: SiteData): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── Blob read (prod) ──────────────────────────────────────
async function readFromBlob(): Promise<SiteData> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    const match = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!match) return { ...INITIAL_DATA };
    // The public `url` is served through a CDN edge that lags behind writes by
    // seconds — reading it right after a `put` returns the previous version,
    // which corrupts read-modify-write cycles (a second admin edit reads stale
    // data and drops the first). `downloadUrl` (?download=1) skips that cache
    // and returns the freshly written content.
    const bust = new Date(match.uploadedAt).getTime();
    const fresh = match.downloadUrl ?? match.url;
    const url = `${fresh}${fresh.includes("?") ? "&" : "?"}v=${bust}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ...INITIAL_DATA };
    return normalize(await res.json());
  } catch (err) {
    console.error("[data] readFromBlob failed:", err);
    return { ...INITIAL_DATA };
  }
}

async function writeToBlob(data: SiteData): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// ── Public sync + async APIs ──────────────────────────────
// The whole codebase already calls these synchronously. We keep the sync
// contract for filesystem mode, and for Blob mode we serve from an in-memory
// cache that's warmed up on first call.

async function ensureCache(): Promise<SiteData> {
  const blob = isBlobStorage();
  const fresh = cache && (!blob || Date.now() - cacheAt < BLOB_CACHE_TTL_MS);
  if (fresh) return cache!;
  if (!cachePromise) {
    cachePromise = (blob ? readFromBlob() : Promise.resolve(readFromFile()))
      .then((d) => { cache = d; cacheAt = Date.now(); cachePromise = null; return d; })
      .catch((err) => { cachePromise = null; throw err; });
  }
  return cachePromise;
}

export async function readDataAsync(): Promise<SiteData> {
  return ensureCache();
}

export function readData(): SiteData {
  if (!isBlobStorage()) {
    if (!cache) cache = readFromFile();
    return cache;
  }
  if (!cache) {
    // In production, some paths still call this synchronously (from top-level
    // page components). Fall back to defaults; the async path will backfill.
    void ensureCache();
    return { ...INITIAL_DATA };
  }
  return cache;
}

export async function writeData(data: SiteData): Promise<void> {
  cache = data;
  cacheAt = Date.now();
  if (isBlobStorage()) {
    await writeToBlob(data);
  } else {
    writeToFile(data);
  }
}

// ── Images ────────────────────────────────────────────────
export function getImagesBySection(section: string): SiteImage[] {
  const data = readData();
  return data.images
    .filter((img) => img.section === section && img.visible)
    .sort((a, b) => a.order - b.order);
}

export async function addImage(image: SiteImage): Promise<void> {
  const data = await readFresh();
  data.images.push(image);
  await writeData(data);
}

export async function readFresh(): Promise<SiteData> {
  // Trust the in-memory cache. Every writeData() replaces `cache` with the
  // just-written document, so back-to-back mutations (e.g. adding several
  // subcategories in a row) always build on top of the latest state.
  //
  // We used to `invalidateCache()` here to pick up writes from other Lambda
  // instances, but Vercel Blob's public read endpoint sits behind a CDN that
  // takes a few seconds to reflect a fresh `put`. Re-reading immediately after
  // writing returned the *previous* version, so the next mutation would drop
  // whatever the previous mutation had added.
  return readDataAsync();
}

export async function updateImage(id: string, updates: Partial<SiteImage>): Promise<void> {
  const data = await readFresh();
  const idx = data.images.findIndex((img) => img.id === id);
  if (idx === -1) throw new Error(`Image ${id} not found`);
  data.images[idx] = { ...data.images[idx], ...updates };
  await writeData(data);
}

export async function deleteImage(id: string): Promise<string | null> {
  const data = await readFresh();
  const img = data.images.find((i) => i.id === id);
  if (!img) return null;
  data.images = data.images.filter((i) => i.id !== id);
  await writeData(data);
  return img.filename;
}

// ── Categories ────────────────────────────────────────────
export function getCategories(): Category[] {
  return [...readData().categories].sort((a, b) => a.order - b.order);
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const data = await readFresh();
  const idx = data.categories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error(`Category ${id} not found`);
  data.categories[idx] = { ...data.categories[idx], ...updates };
  await writeData(data);
}

// ── Subcategories ─────────────────────────────────────────
export function getSubcategories(): Subcategory[] {
  return [...readData().subcategories].sort((a, b) => a.order - b.order);
}

export async function addSubcategory(sub: Subcategory): Promise<void> {
  const data = await readFresh();
  data.subcategories.push(sub);
  await writeData(data);
}

export async function updateSubcategory(id: string, updates: Partial<Subcategory>): Promise<void> {
  const data = await readFresh();
  const idx = data.subcategories.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error(`Subcategory ${id} not found`);
  data.subcategories[idx] = { ...data.subcategories[idx], ...updates };
  await writeData(data);
}

export async function deleteSubcategory(id: string): Promise<void> {
  const data = await readFresh();
  data.subcategories = data.subcategories.filter((s) => s.id !== id);
  data.images = data.images.filter((img) => img.section !== id);
  await writeData(data);
}

// ── FAQs ──────────────────────────────────────────────────
export function getFaqs(): FaqItem[] {
  return [...readData().faqs].sort((a, b) => a.order - b.order);
}

export async function addFaq(faq: FaqItem): Promise<void> {
  const data = await readFresh();
  data.faqs.push(faq);
  await writeData(data);
}

export async function updateFaq(id: string, updates: Partial<FaqItem>): Promise<void> {
  const data = await readFresh();
  const idx = data.faqs.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error(`FAQ ${id} not found`);
  data.faqs[idx] = { ...data.faqs[idx], ...updates };
  await writeData(data);
}

export async function deleteFaq(id: string): Promise<void> {
  const data = await readFresh();
  data.faqs = data.faqs.filter((f) => f.id !== id);
  await writeData(data);
}

// ── Opening Hours ─────────────────────────────────────────
const DEFAULT_HOURS: OpeningHours = {
  weekdays_sq: "E Hënë – E Premte, 8:00 – 18:00",
  weekdays_en: "Monday – Friday, 8:00 AM – 6:00 PM",
  saturday_sq: "E Shtunë, 8:00 – 14:00",
  saturday_en: "Saturday, 8:00 AM – 2:00 PM",
};

export function getOpeningHours(): OpeningHours {
  return readData().openingHours ?? DEFAULT_HOURS;
}

export async function updateOpeningHours(updates: Partial<OpeningHours>): Promise<void> {
  const data = await readFresh();
  data.openingHours = { ...(data.openingHours ?? DEFAULT_HOURS), ...updates };
  await writeData(data);
}

// ── Announcement ──────────────────────────────────────────
const DEFAULT_ANNOUNCEMENT: Announcement = { text_sq: "", text_en: "", active: false, bg: "red" };

export function getAnnouncement(): Announcement {
  return readData().announcement ?? DEFAULT_ANNOUNCEMENT;
}

export async function updateAnnouncement(updates: Partial<Announcement>): Promise<void> {
  const data = await readFresh();
  data.announcement = { ...(data.announcement ?? DEFAULT_ANNOUNCEMENT), ...updates };
  await writeData(data);
}

// ── Cache invalidation (used after direct writes) ─────────
export function invalidateCache() {
  cache = null;
  cacheAt = 0;
  cachePromise = null;
}
