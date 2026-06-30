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
  coverImage?: string;   // URL of the cover photo
  coverPosition?: string; // Tailwind object-position class e.g. "object-center"
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
  modelUrl?: string;    // path to .glb file in /public/models/, e.g. "/models/cadra-basic.glb"
}

export interface FaqItem {
  id: string;
  q_sq: string;
  a_sq: string;
  q_en: string;
  a_en: string;
  order: number;
}

export interface OpeningHours {
  weekdays_sq: string;
  weekdays_en: string;
  saturday_sq: string;
  saturday_en: string;
}

export interface Announcement {
  text_sq: string;
  text_en: string;
  active: boolean;
  bg: "red" | "dark" | "yellow";
  link?: string;
}

export interface SiteData {
  images: SiteImage[];
  categories: Category[];
  subcategories: Subcategory[];
  faqs: FaqItem[];
  openingHours?: OpeningHours;
  announcement?: Announcement;
}
