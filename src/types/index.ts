// Fixed image sections (non-product)
export type FixedSection = "hero" | "portfolio" | "about";

// Image section is either a fixed section or a subcategory id (any string)
export type ImageSection = FixedSection | string;

export interface SiteImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  section: ImageSection;
  title?: string;
  description?: string;
  order: number;
  visible: boolean;
  uploadedAt: string;
}

// Top-level product category: Tenda or Çadra
export interface Category {
  id: string;           // e.g. "tenda" | "cadra"
  name_sq: string;
  name_en: string;
  icon: string;         // emoji
  order: number;
}

// Subcategory belonging to a Category
export interface Subcategory {
  id: string;           // uuid — also used as ImageSection
  categoryId: string;
  name_sq: string;
  name_en: string;
  desc_sq: string;
  desc_en: string;
  order: number;
}

export interface SiteData {
  images: SiteImage[];
  categories: Category[];
  subcategories: Subcategory[];
}
