import fs from "fs";
import path from "path";
import type { SiteData, SiteImage, Category, Subcategory } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data", "site-data.json");

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

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const initial: SiteData = {
      images: [],
      categories: DEFAULT_CATEGORIES,
      subcategories: DEFAULT_SUBCATEGORIES,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

export function readData(): SiteData {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw) as SiteData;
  // Back-fill new fields on older data files
  if (!data.categories) data.categories = DEFAULT_CATEGORIES;
  if (!data.subcategories) data.subcategories = DEFAULT_SUBCATEGORIES;
  return data;
}

export function writeData(data: SiteData): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── Images ────────────────────────────────────────────────
export function getImagesBySection(section: string): SiteImage[] {
  const data = readData();
  return data.images
    .filter((img) => img.section === section && img.visible)
    .sort((a, b) => a.order - b.order);
}

export function addImage(image: SiteImage): void {
  const data = readData();
  data.images.push(image);
  writeData(data);
}

export function updateImage(id: string, updates: Partial<SiteImage>): void {
  const data = readData();
  const idx = data.images.findIndex((img) => img.id === id);
  if (idx !== -1) {
    data.images[idx] = { ...data.images[idx], ...updates };
    writeData(data);
  }
}

export function deleteImage(id: string): string | null {
  const data = readData();
  const img = data.images.find((i) => i.id === id);
  if (!img) return null;
  data.images = data.images.filter((i) => i.id !== id);
  writeData(data);
  return img.filename;
}

// ── Categories ────────────────────────────────────────────
export function getCategories(): Category[] {
  return readData().categories.sort((a, b) => a.order - b.order);
}

// ── Subcategories ─────────────────────────────────────────
export function getSubcategories(): Subcategory[] {
  return readData().subcategories.sort((a, b) => a.order - b.order);
}

export function addSubcategory(sub: Subcategory): void {
  const data = readData();
  data.subcategories.push(sub);
  writeData(data);
}

export function updateSubcategory(id: string, updates: Partial<Subcategory>): void {
  const data = readData();
  const idx = data.subcategories.findIndex((s) => s.id === id);
  if (idx !== -1) {
    data.subcategories[idx] = { ...data.subcategories[idx], ...updates };
    writeData(data);
  }
}

export function deleteSubcategory(id: string): void {
  const data = readData();
  data.subcategories = data.subcategories.filter((s) => s.id !== id);
  // Also remove images belonging to this subcategory
  data.images = data.images.filter((img) => img.section !== id);
  writeData(data);
}
