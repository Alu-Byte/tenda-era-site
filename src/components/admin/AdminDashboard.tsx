"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload, Trash2, Eye, EyeOff, LogOut, RefreshCw,
  Image as ImageIcon, LayoutGrid,
  Edit2, Check, X, Package, Plus, GripVertical,
  ChevronUp, ChevronDown, Lock, MessageSquare, Languages,
  Bell, Clock,
} from "lucide-react";
import type { SiteImage, Category, Subcategory, FaqItem, OpeningHours, Announcement } from "@/types";
import { invalidateSiteInfoCache } from "@/lib/useSiteInfo";

const FIXED_SECTIONS = [
  { value: "hero", label: "Hero (Faqja Kryesore)" },
  { value: "home-portfolio", label: "Faqja · Projektet e Fundit" },
  { value: "portfolio", label: "Faqja e Portofolit" },
  { value: "about", label: "Faqja Rreth Nesh" },
];

type Tab = "images" | "products" | "faq" | "settings";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("images");
  const router = useRouter();

  // ── Images ──
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loadingImgs, setLoadingImgs] = useState(true);
  const [filterSection, setFilterSection] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [uploadSection, setUploadSection] = useState<string>("portfolio");
  const [uploadTitle, setUploadTitle] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [editingImgId, setEditingImgId] = useState<string | null>(null);
  const [editImgTitle, setEditImgTitle] = useState("");
  const [editImgSection, setEditImgSection] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingSelected, setDeletingSelected] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Products ──
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingProds, setLoadingProds] = useState(true);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subEdits, setSubEdits] = useState<Partial<Subcategory>>({});
  const [addingTo, setAddingTo] = useState<string | null>(null); // categoryId
  const [newSub, setNewSub] = useState({ name_sq: "", name_en: "", desc_sq: "", desc_en: "" });
  const [savingSub, setSavingSub] = useState(false);
  const [uploadingCover, setUploadingCover] = useState<string | null>(null);
  const coverRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── FAQ ──
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqEdits, setFaqEdits] = useState<Partial<FaqItem>>({});
  const [addingFaq, setAddingFaq] = useState(false);
  const [newFaq, setNewFaq] = useState({ q_sq: "", a_sq: "", q_en: "", a_en: "" });
  const [savingFaq, setSavingFaq] = useState(false);

  // ── Settings / Password ──
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // ── Opening Hours ──
  const [hours, setHours] = useState<OpeningHours>({
    weekdays_sq: "E Hënë – E Premte, 8:00 – 18:00",
    weekdays_en: "Monday – Friday, 8:00 AM – 6:00 PM",
    saturday_sq: "E Shtunë, 8:00 – 14:00",
    saturday_en: "Saturday, 8:00 AM – 2:00 PM",
  });
  const [savingHours, setSavingHours] = useState(false);
  const [hoursMsg, setHoursMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Announcement ──
  const [ann, setAnn] = useState<Announcement>({ text_sq: "", text_en: "", active: false, bg: "red" });
  const [savingAnn, setSavingAnn] = useState(false);
  const [annMsg, setAnnMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Translation ──
  const [translatingFaq, setTranslatingFaq] = useState(false);
  const [translatingSub, setTranslatingSub] = useState(false);

  // ── Fetch ──
  async function fetchImages() {
    setLoadingImgs(true);
    const res = await fetch("/api/admin/images");
    const data = await res.json();
    setImages(Array.isArray(data) ? data : []);
    setLoadingImgs(false);
  }

  async function fetchProducts() {
    setLoadingProds(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setSubcategories(data.subcategories ?? []);
    setLoadingProds(false);
  }

  async function fetchFaqs() {
    setLoadingFaqs(true);
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    setFaqs(Array.isArray(data) ? data : []);
    setLoadingFaqs(false);
  }

  async function fetchSiteInfo() {
    const res = await fetch("/api/admin/site");
    const data = await res.json();
    if (data.openingHours) setHours(data.openingHours);
    if (data.announcement) setAnn(data.announcement);
  }

  useEffect(() => { fetchImages(); fetchProducts(); fetchFaqs(); fetchSiteInfo(); }, []);

  // ── Computed section list for upload dropdown ──
  const allSections = [
    ...FIXED_SECTIONS,
    ...subcategories.map((s) => ({
      value: s.id,
      label: `${categories.find((c) => c.id === s.categoryId)?.name_en ?? s.categoryId} → ${s.name_en}`,
    })),
  ];

  // ── Image actions ──
  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      form.append("section", uploadSection);
      form.append("title", uploadTitle || file.name.replace(/\.[^.]+$/, ""));
      await fetch("/api/admin/upload", { method: "POST", body: form });
    }
    setUploadTitle("");
    if (fileRef.current) fileRef.current.value = "";
    await fetchImages();
    setUploading(false);
  }

  async function toggleVisible(img: SiteImage) {
    await fetch("/api/admin/images", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: img.id, visible: !img.visible }),
    });
    setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, visible: !i.visible } : i));
  }

  async function deleteImg(id: string) {
    if (!confirm("Fshi këtë foto përgjithmonë?")) return;
    await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setImages((prev) => prev.filter((i) => i.id !== id));
  }

  function startImgEdit(img: SiteImage) {
    setEditingImgId(img.id);
    setEditImgTitle(img.title || "");
    setEditImgSection(img.section);
  }

  async function saveImgEdit(id: string) {
    await fetch("/api/admin/images", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: editImgTitle, section: editImgSection }),
    });
    setImages((prev) => prev.map((i) => i.id === id ? { ...i, title: editImgTitle, section: editImgSection } : i));
    setEditingImgId(null);
  }

  async function changeOrder(img: SiteImage, dir: "up" | "down") {
    const group = images.filter((i) => i.section === img.section).sort((a, b) => a.order - b.order);
    const idx = group.findIndex((i) => i.id === img.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= group.length) return;
    const a = group[idx], b = group[swapIdx];
    await Promise.all([
      fetch("/api/admin/images", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, order: b.order }) }),
      fetch("/api/admin/images", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, order: a.order }) }),
    ]);
    setImages((prev) => prev.map((i) => {
      if (i.id === a.id) return { ...i, order: b.order };
      if (i.id === b.id) return { ...i, order: a.order };
      return i;
    }));
  }

  // ── Subcategory actions ──
  async function addSubcategory(categoryId: string) {
    if (!newSub.name_sq && !newSub.name_en) return;
    setSavingSub(true);
    const id = `${categoryId}-${Date.now()}`;
    const subs = subcategories.filter((s) => s.categoryId === categoryId);
    const sub: Subcategory = {
      id,
      categoryId,
      name_sq: newSub.name_sq,
      name_en: newSub.name_en,
      desc_sq: newSub.desc_sq,
      desc_en: newSub.desc_en,
      order: subs.length + 1,
    };
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    setSubcategories((prev) => [...prev, sub]);
    setNewSub({ name_sq: "", name_en: "", desc_sq: "", desc_en: "" });
    setAddingTo(null);
    setSavingSub(false);
  }

  async function saveSubEdit(id: string) {
    setSavingSub(true);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...subEdits }),
    });
    setSubcategories((prev) => prev.map((s) => s.id === id ? { ...s, ...subEdits } as Subcategory : s));
    setEditingSubId(null);
    setSavingSub(false);
  }

  async function deleteSub(id: string) {
    if (!confirm("Fshi këtë nënkategori dhe të gjitha fotot e saj?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubcategories((prev) => prev.filter((s) => s.id !== id));
    setImages((prev) => prev.filter((img) => img.section !== id));
  }

  // ── FAQ actions ──
  async function addFaqItem() {
    if (!newFaq.q_sq && !newFaq.q_en) return;
    setSavingFaq(true);
    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      q_sq: newFaq.q_sq, a_sq: newFaq.a_sq,
      q_en: newFaq.q_en, a_en: newFaq.a_en,
      order: faqs.length + 1,
    };
    await fetch("/api/admin/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setFaqs((prev) => [...prev, item]);
    setNewFaq({ q_sq: "", a_sq: "", q_en: "", a_en: "" });
    setAddingFaq(false);
    setSavingFaq(false);
  }

  async function saveFaqEdit(id: string) {
    setSavingFaq(true);
    await fetch("/api/admin/faq", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...faqEdits }) });
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, ...faqEdits } as FaqItem : f));
    setEditingFaqId(null);
    setSavingFaq(false);
  }

  async function deleteFaqItem(id: string) {
    if (!confirm("Fshi këtë pyetje?")) return;
    await fetch("/api/admin/faq", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

  async function moveFaq(faq: FaqItem, dir: "up" | "down") {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((f) => f.id === faq.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    await Promise.all([
      fetch("/api/admin/faq", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id, order: b.order }) }),
      fetch("/api/admin/faq", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, order: a.order }) }),
    ]);
    setFaqs((prev) => prev.map((f) => {
      if (f.id === a.id) return { ...f, order: b.order };
      if (f.id === b.id) return { ...f, order: a.order };
      return f;
    }));
  }

  // ── Translation helpers ──
  async function translateSq(text: string): Promise<string> {
    if (!text.trim()) return "";
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      return data.translated ?? "";
    } catch { return ""; }
  }

  async function handleTranslateNewFaq() {
    setTranslatingFaq(true);
    const [q_en, a_en] = await Promise.all([translateSq(newFaq.q_sq), translateSq(newFaq.a_sq)]);
    setNewFaq((p) => ({ ...p, q_en: q_en || p.q_en, a_en: a_en || p.a_en }));
    setTranslatingFaq(false);
  }

  async function handleTranslateFaqEdit() {
    if (!editingFaqId) return;
    const src = faqs.find((f) => f.id === editingFaqId);
    if (!src) return;
    setTranslatingFaq(true);
    const [q_en, a_en] = await Promise.all([
      translateSq(faqEdits.q_sq ?? src.q_sq),
      translateSq(faqEdits.a_sq ?? src.a_sq),
    ]);
    setFaqEdits((p) => ({ ...p, q_en: q_en || p.q_en, a_en: a_en || p.a_en }));
    setTranslatingFaq(false);
  }

  async function handleTranslateNewSub() {
    setTranslatingSub(true);
    const [name_en, desc_en] = await Promise.all([translateSq(newSub.name_sq), translateSq(newSub.desc_sq)]);
    setNewSub((p) => ({ ...p, name_en: name_en || p.name_en, desc_en: desc_en || p.desc_en }));
    setTranslatingSub(false);
  }

  async function handleTranslateSubEdit() {
    if (!editingSubId) return;
    const src = subcategories.find((s) => s.id === editingSubId);
    if (!src) return;
    setTranslatingSub(true);
    const [name_en, desc_en] = await Promise.all([
      translateSq(subEdits.name_sq ?? src.name_sq),
      translateSq(subEdits.desc_sq ?? src.desc_sq),
    ]);
    setSubEdits((p) => ({ ...p, name_en: name_en || p.name_en, desc_en: desc_en || p.desc_en }));
    setTranslatingSub(false);
  }

  // ── Hours actions ──
  async function handleSaveHours() {
    setSavingHours(true);
    setHoursMsg(null);
    const res = await fetch("/api/admin/site", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "hours", ...hours }),
    });
    if (res.ok) {
      setHoursMsg({ type: "ok", text: "Orari u ruajt me sukses!" });
      invalidateSiteInfoCache();
    } else {
      setHoursMsg({ type: "err", text: "Gabim gjatë ruajtjes." });
    }
    setSavingHours(false);
  }

  // ── Announcement actions ──
  async function handleSaveAnnouncement() {
    setSavingAnn(true);
    setAnnMsg(null);
    const res = await fetch("/api/admin/site", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "announcement", ...ann }),
    });
    if (res.ok) {
      setAnnMsg({ type: "ok", text: "Njoftimi u ruajt me sukses!" });
      invalidateSiteInfoCache();
    } else {
      setAnnMsg({ type: "err", text: "Gabim gjatë ruajtjes." });
    }
    setSavingAnn(false);
  }

  // ── Password actions ──
  async function handlePasswordChange() {
    setPwdMsg(null);
    if (newPwd !== confirmPwd) { setPwdMsg({ type: "err", text: "Fjalëkalimet e reja nuk përputhen." }); return; }
    if (newPwd.length < 8) { setPwdMsg({ type: "err", text: "Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere." }); return; }
    setSavingPwd(true);
    const res = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }) });
    const data = await res.json();
    if (!res.ok) { setPwdMsg({ type: "err", text: data.error ?? "Gabim." }); }
    else { setPwdMsg({ type: "ok", text: "Fjalëkalimi u ndryshua me sukses!" }); setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); }
    setSavingPwd(false);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(filtered.map((i) => i.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function handleDragStart(id: string) {
    setDraggingId(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== draggingId) setDragOverId(id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
  }

  async function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) { handleDragEnd(); return; }

    const group = [...filtered];
    const fromIdx = group.findIndex((i) => i.id === draggingId);
    const toIdx = group.findIndex((i) => i.id === targetId);
    const [moved] = group.splice(fromIdx, 1);
    group.splice(toIdx, 0, moved);

    const updates = group.map((img, idx) => ({ id: img.id, order: idx + 1 }));
    const orderMap = new Map(updates.map((u) => [u.id, u.order]));

    setImages((prev) => prev.map((img) => orderMap.has(img.id) ? { ...img, order: orderMap.get(img.id)! } : img));

    await Promise.all(
      updates.map((u) =>
        fetch("/api/admin/images", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: u.id, order: u.order }),
        })
      )
    );

    handleDragEnd();
  }

  async function deleteSelected() {
    setDeletingSelected(true);
    await Promise.all(
      Array.from(selected).map((id) =>
        fetch("/api/admin/images", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
      )
    );
    setImages((prev) => prev.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
    setSelectMode(false);
    setShowDeleteConfirm(false);
    setDeletingSelected(false);
  }

  async function saveCoverPosition(catId: string, position: string) {
    setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, coverPosition: position } : c));
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: catId, type: "category", coverPosition: position }),
    });
  }

  async function uploadCover(catId: string, file: File) {
    setUploadingCover(catId);
    const form = new FormData();
    form.append("file", file);
    form.append("section", `cat-cover-${catId}`);
    form.append("title", `${catId} cover`);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.image?.url) {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: catId, type: "category", coverImage: data.image.url }),
      });
      setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, coverImage: data.image.url } : c));
    }
    setUploadingCover(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const filtered = (filterSection === "all" ? images : images.filter((i) => i.section === filterSection))
    .sort((a, b) => a.order - b.order);

  function sectionLabel(section: string) {
    const fixed = FIXED_SECTIONS.find((s) => s.value === section);
    if (fixed) return fixed.label;
    const sub = subcategories.find((s) => s.id === section);
    if (sub) {
      const cat = categories.find((c) => c.id === sub.categoryId);
      return `${cat?.name_en ?? ""} → ${sub.name_en}`;
    }
    return section;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-[#1a1a1a] text-white px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#c0231e] flex items-center justify-center font-bold text-sm">T</div>
          <div>
            <p className="font-semibold text-sm">Tenda Era</p>
            <p className="text-white/50 text-xs">Paneli i Adminit</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-white/60 hover:text-white text-xs flex items-center gap-1 transition-colors">
            <LayoutGrid size={14} /> Shiko Faqen
          </a>
          <button onClick={logout} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <LogOut size={16} /> Dilni
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 flex">
        <button onClick={() => setTab("images")} className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === "images" ? "border-[#c0231e] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          <ImageIcon size={16} /> Fotot
        </button>
        <button onClick={() => setTab("products")} className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === "products" ? "border-[#c0231e] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          <Package size={16} /> Produktet
        </button>
        <button onClick={() => setTab("faq")} className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === "faq" ? "border-[#c0231e] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          FAQ
        </button>
        <button onClick={() => setTab("settings")} className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === "settings" ? "border-[#c0231e] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          Cilësimet
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 flex gap-8">

        {/* ══════════════ IMAGES TAB ══════════════ */}
        {tab === "images" && (
          <>
            {/* Sidebar */}
            <aside className="w-52 shrink-0 hidden lg:block">
              <nav className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-3">Filtro</p>
                {[{ value: "all", label: `Të gjitha (${images.length})` }, ...FIXED_SECTIONS].map((s) => (
                  <button key={s.value} onClick={() => setFilterSection(s.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${filterSection === s.value ? "bg-[#1a1a1a] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                    {s.label}
                  </button>
                ))}
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1 font-semibold">{cat.name_en}</p>
                    {subcategories.filter((s) => s.categoryId === cat.id).map((sub) => (
                      <button key={sub.id} onClick={() => setFilterSection(sub.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${filterSection === sub.id ? "bg-[#1a1a1a] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                        {sub.name_en}
                        {images.filter((i) => i.section === sub.id).length > 0 && (
                          <span className="ml-1 text-xs text-gray-400">({images.filter((i) => i.section === sub.id).length})</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </aside>

            <main className="flex-1 min-w-0">
              {/* Upload zone */}
              <div
                className={`mb-8 border-2 border-dashed rounded-2xl p-6 bg-white transition-colors ${dragOver ? "border-[#c0231e] bg-[#c0231e]/5" : "border-gray-200"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
              >
                <div className="flex flex-col sm:flex-row gap-4 mb-5">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Ngarko në Seksion</label>
                    <select value={uploadSection} onChange={(e) => setUploadSection(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm text-gray-700">
                      {allSections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Titulli (opsional)</label>
                    <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="p.sh. Tendë Plazhi"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                  </div>
                </div>
                <div className="text-center">
                  <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-1">
                    Tërhiq & lësho, ose{" "}
                    <button onClick={() => fileRef.current?.click()} className="text-[#c0231e] font-semibold hover:underline">zgjidh skedarë</button>
                  </p>
                  <p className="text-gray-400 text-xs">JPG, PNG, WebP — shumë skedarë mbështeten</p>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                  {uploading && <div className="mt-3 flex items-center justify-center gap-2 text-[#c0231e]"><RefreshCw size={16} className="animate-spin" /><span className="text-sm">Duke ngarkuar...</span></div>}
                </div>
              </div>

              {/* Mobile filter pills */}
              <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {[{ value: "all", label: "Të gjitha" }, ...allSections].map((s) => (
                  <button key={s.value} onClick={() => setFilterSection(s.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterSection === s.value ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <p className="text-sm font-semibold text-gray-600">
                  {filtered.length} foto
                  {filterSection !== "all" && <span className="font-normal text-gray-400"> · {sectionLabel(filterSection)}</span>}
                  {selectMode && selected.size > 0 && <span className="ml-2 text-[#c0231e]">· {selected.size} të zgjedhura</span>}
                </p>
                <div className="flex items-center gap-2">
                  {!selectMode ? (
                    filtered.length > 0 && (
                      <button
                        onClick={() => setSelectMode(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} /> Fshi foto
                      </button>
                    )
                  ) : (
                    <>
                      {selected.size === filtered.length ? (
                        <button onClick={clearSelection} className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Çzgjidh të gjitha</button>
                      ) : (
                        <button onClick={selectAll} className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Zgjidh të gjitha</button>
                      )}
                      {selected.size > 0 && (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={13} /> Fshi {selected.size}
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectMode(false); clearSelection(); }}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        Anulo
                      </button>
                    </>
                  )}
                  <button onClick={fetchImages} className="text-gray-400 hover:text-gray-600 p-1"><RefreshCw size={15} /></button>
                </div>
              </div>

              {loadingImgs ? (
                <div className="flex items-center justify-center py-24 text-gray-300"><RefreshCw size={24} className="animate-spin" /></div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <ImageIcon size={40} className="text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">Nuk ka foto ende</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filtered.map((img) => {
                    const isSelected = selected.has(img.id);
                    const isDragging = draggingId === img.id;
                    const isDragOver = dragOverId === img.id;
                    return (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => handleDragStart(img.id)}
                      onDragOver={(e) => handleDragOver(e, img.id)}
                      onDrop={(e) => handleDrop(e, img.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-grab active:cursor-grabbing ${
                        isDragging ? "opacity-40 scale-95" :
                        isDragOver ? "border-[#c0231e] ring-2 ring-[#c0231e]/40 scale-[1.02]" :
                        isSelected ? "border-[#c0231e] ring-2 ring-[#c0231e]/30" :
                        !img.visible ? "opacity-50 border-gray-200" :
                        "border-gray-100 hover:border-[#c0231e]/50 hover:shadow-md"
                      }`}
                    >
                      <div className="relative aspect-square bg-gray-100">
                        <Image src={img.url} alt={img.title || img.filename} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                          <button onClick={() => toggleVisible(img)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#c0231e] hover:text-white transition-colors">{img.visible ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                          <button onClick={() => startImgEdit(img)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-colors"><Edit2 size={15} /></button>
                          <button onClick={() => deleteImg(img.id)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={15} /></button>
                        </div>
                        {/* Drag handle */}
                        <div className="absolute top-2 right-2 p-1 rounded-md bg-black/30 text-white opacity-0 group-hover:opacity-100 pointer-events-none">
                          <GripVertical size={14} />
                        </div>
                        {/* Checkbox — only visible in select mode */}
                        {selectMode && (
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); toggleSelect(img.id); }}
                            className={`absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#c0231e] border-[#c0231e]" : "bg-white/80 border-gray-300 hover:border-[#c0231e]"}`}
                          >
                            {isSelected && <Check size={13} className="text-white" />}
                          </button>
                        )}
                        {!img.visible && <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff size={10} /> E fshehur</div>}
                      </div>
                      <div className="p-3">
                        {editingImgId === img.id ? (
                          <div className="space-y-2">
                            <input value={editImgTitle} onChange={(e) => setEditImgTitle(e.target.value)} placeholder="Titulli" className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:border-[#c0231e] focus:outline-none" />
                            <select value={editImgSection} onChange={(e) => setEditImgSection(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:border-[#c0231e] focus:outline-none">
                              {allSections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            <div className="flex gap-1.5">
                              <button onClick={() => saveImgEdit(img.id)} className="flex-1 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-lg flex items-center justify-center gap-1"><Check size={11} /> Ruaj</button>
                              <button onClick={() => setEditingImgId(null)} className="flex-1 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg flex items-center justify-center gap-1"><X size={11} /> Anulo</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-semibold text-gray-700 truncate">{img.title || img.originalName}</p>
                            <p className="text-xs text-[#c0231e] mt-0.5 truncate">{sectionLabel(img.section)}</p>
                            <p className="text-gray-300 text-xs mt-1">{new Date(img.uploadedAt).toLocaleDateString()}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </main>
          </>
        )}

        {/* ══════════════ PRODUCTS TAB ══════════════ */}
        {tab === "products" && (
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Kategoritë e Produkteve</h2>
              <p className="text-sm text-gray-400 mt-1">Shto, ndrysho ose fshi nënkategoritë nën çdo kategori kryesore. Këto shfaqen në faqen e Produkteve.</p>
            </div>

            {loadingProds ? (
              <div className="flex items-center justify-center py-24 text-gray-300"><RefreshCw size={24} className="animate-spin" /></div>
            ) : (
              <div className="space-y-8">
                {categories.map((cat) => {
                  const subs = subcategories.filter((s) => s.categoryId === cat.id).sort((a, b) => a.order - b.order);
                  const isAdding = addingTo === cat.id;

                  return (
                    <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      {/* Category header */}
                      <div className="relative flex items-center justify-between px-6 py-4 bg-[#1a1a1a] overflow-hidden min-h-[72px]">
                        {cat.coverImage && (
                          <Image src={cat.coverImage} alt={cat.name_en} fill className="object-cover opacity-20" />
                        )}
                        <div className="relative flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <p className="font-display text-lg font-semibold text-white">{cat.name_sq}</p>
                            <p className="text-white/50 text-xs">{cat.name_en}</p>
                          </div>
                        </div>
                        <div className="relative flex items-center gap-2">
                          {/* Cover photo upload */}
                          <button
                            onClick={() => coverRefs.current[cat.id]?.click()}
                            disabled={uploadingCover === cat.id}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 text-white text-xs font-semibold rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                          >
                            {uploadingCover === cat.id ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
                            {cat.coverImage ? "Ndrysho Kopertinën" : "Shto Kopertinë"}
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(el) => { coverRefs.current[cat.id] = el; }}
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(cat.id, f); }}
                          />
                          <button
                            onClick={() => { setAddingTo(isAdding ? null : cat.id); setNewSub({ name_sq: "", name_en: "", desc_sq: "", desc_en: "" }); }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#c0231e] text-white text-sm font-semibold rounded-xl hover:bg-[#9a1c18] transition-colors"
                          >
                            <Plus size={15} /> Shto Nënkategori
                          </button>
                        </div>
                      </div>

                      {/* Cover position picker — click anywhere on preview */}
                      {cat.coverImage && (() => {
                        const posParts = (cat.coverPosition ?? "50% 50%").split(" ");
                        const dotX = parseFloat(posParts[0]) || 50;
                        const dotY = parseFloat(posParts[1]) || 50;
                        return (
                          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">Pozicioni</span>
                            <div
                              className="relative w-40 h-24 rounded-xl overflow-hidden border-2 border-[#c0231e]/40 cursor-crosshair shrink-0 hover:border-[#c0231e] transition-colors"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                saveCoverPosition(cat.id, `${x}% ${y}%`);
                              }}
                            >
                              <Image
                                src={cat.coverImage}
                                alt="cover preview"
                                fill
                                className="object-cover pointer-events-none"
                                style={{ objectPosition: cat.coverPosition ?? "50% 50%" }}
                              />
                              <div
                                className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#c0231e] shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ left: `${dotX}%`, top: `${dotY}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">Kliko mbi foto<br />për të vendosur<br />pikën e fokusit</p>
                          </div>
                        );
                      })()}

                      {/* Add subcategory form */}
                      {isAdding && (
                        <div className="px-6 py-5 bg-[#c0231e]/5 border-b border-[#c0231e]/20">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Nënkategori e Re</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇦🇱 Emri (Shqip) *</label>
                              <input value={newSub.name_sq} onChange={(e) => setNewSub((p) => ({ ...p, name_sq: e.target.value }))}
                                placeholder="p.sh. Tendë Tërheqëse" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇬🇧 Emri (Anglisht) *</label>
                              <input value={newSub.name_en} onChange={(e) => setNewSub((p) => ({ ...p, name_en: e.target.value }))}
                                placeholder="e.g. Retractable Awning" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇦🇱 Përshkrimi (Shqip)</label>
                              <textarea rows={2} value={newSub.desc_sq} onChange={(e) => setNewSub((p) => ({ ...p, desc_sq: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇬🇧 Përshkrimi (Anglisht)</label>
                              <textarea rows={2} value={newSub.desc_en} onChange={(e) => setNewSub((p) => ({ ...p, desc_en: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <button onClick={handleTranslateNewSub} disabled={translatingSub || !newSub.name_sq}
                              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-40">
                              {translatingSub ? <RefreshCw size={13} className="animate-spin" /> : <Languages size={14} />}
                              🇦🇱 → 🇬🇧
                            </button>
                            <div className="flex-1" />
                            <button onClick={() => addSubcategory(cat.id)} disabled={savingSub || (!newSub.name_sq && !newSub.name_en)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors disabled:opacity-50">
                              {savingSub ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />} Shto
                            </button>
                            <button onClick={() => setAddingTo(null)} className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                              Anulo
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Subcategory list */}
                      {subs.length === 0 && !isAdding ? (
                        <div className="px-6 py-10 text-center text-gray-400 text-sm">Nuk ka nënkategori ende. Kliko "Shto Nënkategori" për të krijuar një.</div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {subs.map((sub) => {
                            const isEditing = editingSubId === sub.id;
                            const imgCount = images.filter((img) => img.section === sub.id).length;

                            return (
                              <div key={sub.id} className="px-6 py-5">
                                {isEditing ? (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🇦🇱 Emri (Shqip)</label>
                                        <input value={subEdits.name_sq ?? sub.name_sq} onChange={(e) => setSubEdits((p) => ({ ...p, name_sq: e.target.value }))}
                                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🇬🇧 Emri (Anglisht)</label>
                                        <input value={subEdits.name_en ?? sub.name_en} onChange={(e) => setSubEdits((p) => ({ ...p, name_en: e.target.value }))}
                                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🇦🇱 Përshkrimi (Shqip)</label>
                                        <textarea rows={2} value={subEdits.desc_sq ?? sub.desc_sq} onChange={(e) => setSubEdits((p) => ({ ...p, desc_sq: e.target.value }))}
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🇬🇧 Përshkrimi (Anglisht)</label>
                                        <textarea rows={2} value={subEdits.desc_en ?? sub.desc_en} onChange={(e) => setSubEdits((p) => ({ ...p, desc_en: e.target.value }))}
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🟦 3D Model (vendos skedarin .glb në /public/models/)</label>
                                        <input
                                          value={subEdits.modelUrl ?? sub.modelUrl ?? ""}
                                          onChange={(e) => setSubEdits((p) => ({ ...p, modelUrl: e.target.value || undefined }))}
                                          placeholder="/models/cadra-basic.glb"
                                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm font-mono"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                      <button onClick={handleTranslateSubEdit} disabled={translatingSub}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-40">
                                        {translatingSub ? <RefreshCw size={13} className="animate-spin" /> : <Languages size={14} />}
                                        🇦🇱 → 🇬🇧
                                      </button>
                                      <div className="flex-1" />
                                      <button onClick={() => saveSubEdit(sub.id)} disabled={savingSub}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors disabled:opacity-50">
                                        {savingSub ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />} Ruaj
                                      </button>
                                      <button onClick={() => setEditingSubId(null)} className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl">Anulo</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-1">
                                        <p className="font-semibold text-gray-800">{sub.name_en}</p>
                                        <span className="text-gray-400 text-sm">/ {sub.name_sq}</span>
                                        {imgCount > 0 && (
                                          <span className="text-xs bg-[#c0231e]/10 text-[#c0231e] font-semibold px-2 py-0.5 rounded-full">
                                            {imgCount} foto
                                          </span>
                                        )}
                                      </div>
                                      {sub.desc_en && <p className="text-sm text-gray-400 leading-relaxed">{sub.desc_en}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button onClick={() => { setEditingSubId(sub.id); setSubEdits({}); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-[#c0231e] transition-colors">
                                        <Edit2 size={12} /> Ndrysho
                                      </button>
                                      <button onClick={() => deleteSub(sub.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                                        <Trash2 size={12} /> Fshi
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}
      </div>

      {/* ══════════════ FAQ TAB ══════════════ */}
      {tab === "faq" && (
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pyetje të Shpeshta</h2>
              <p className="text-sm text-gray-400 mt-0.5">Shfaqen në faqen kryesore · <span className="font-semibold text-gray-600">{faqs.length} pyetje</span></p>
            </div>
            <button
              onClick={() => { setAddingFaq(!addingFaq); setNewFaq({ q_sq: "", a_sq: "", q_en: "", a_en: "" }); }}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${addingFaq ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-[#c0231e] text-white hover:bg-[#9a1c18]"}`}
            >
              {addingFaq ? <><X size={15} /> Anulo</> : <><Plus size={15} /> Shto Pyetje</>}
            </button>
          </div>

          {loadingFaqs ? (
            <div className="flex items-center justify-center py-24 text-gray-300"><RefreshCw size={24} className="animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              {/* ── Add form ── */}
              {addingFaq && (
                <div className="bg-white rounded-2xl border-2 border-[#c0231e]/25 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-[#c0231e]/8 to-transparent border-b border-[#c0231e]/10 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#c0231e] flex items-center justify-center shrink-0">
                      <Plus size={13} className="text-white" />
                    </div>
                    <p className="font-semibold text-[#c0231e] text-sm">Pyetje e re</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Albanian column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                          <span>🇦🇱</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Shqip</span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pyetja *</label>
                          <input value={newFaq.q_sq} onChange={(e) => setNewFaq((p) => ({ ...p, q_sq: e.target.value }))}
                            placeholder="p.sh. A janë rezistente ndaj ujit?"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Përgjigja</label>
                          <textarea rows={4} value={newFaq.a_sq} onChange={(e) => setNewFaq((p) => ({ ...p, a_sq: e.target.value }))}
                            placeholder="Shkruaj përgjigjen këtu..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                      </div>
                      {/* English column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                          <span>🇬🇧</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">English</span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Question *</label>
                          <input value={newFaq.q_en} onChange={(e) => setNewFaq((p) => ({ ...p, q_en: e.target.value }))}
                            placeholder="e.g. Are they waterproof?"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Answer</label>
                          <textarea rows={4} value={newFaq.a_en} onChange={(e) => setNewFaq((p) => ({ ...p, a_en: e.target.value }))}
                            placeholder="Write the answer here..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                      <button onClick={handleTranslateNewFaq} disabled={translatingFaq || !newFaq.q_sq}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-40">
                        {translatingFaq ? <RefreshCw size={13} className="animate-spin" /> : <Languages size={14} />}
                        🇦🇱 → 🇬🇧
                      </button>
                      <div className="flex-1" />
                      <button onClick={addFaqItem} disabled={savingFaq || (!newFaq.q_sq && !newFaq.q_en)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors disabled:opacity-50">
                        {savingFaq ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />} Shto Pyetjen
                      </button>
                      <button onClick={() => setAddingFaq(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">Anulo</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── FAQ list ── */}
              {[...faqs].sort((a, b) => a.order - b.order).map((faq, idx, arr) => (
                <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {editingFaqId === faq.id ? (
                    <div>
                      <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                        <Edit2 size={14} className="text-amber-500" />
                        <p className="font-semibold text-amber-700 text-sm">Duke ndryshuar pyetjen #{idx + 1}</p>
                      </div>
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                              <span>🇦🇱</span>
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Shqip</span>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pyetja</label>
                              <input value={faqEdits.q_sq ?? faq.q_sq} onChange={(e) => setFaqEdits((p) => ({ ...p, q_sq: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Përgjigja</label>
                              <textarea rows={4} value={faqEdits.a_sq ?? faq.a_sq} onChange={(e) => setFaqEdits((p) => ({ ...p, a_sq: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none bg-gray-50 focus:bg-white transition-colors" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                              <span>🇬🇧</span>
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">English</span>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Question</label>
                              <input value={faqEdits.q_en ?? faq.q_en} onChange={(e) => setFaqEdits((p) => ({ ...p, q_en: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Answer</label>
                              <textarea rows={4} value={faqEdits.a_en ?? faq.a_en} onChange={(e) => setFaqEdits((p) => ({ ...p, a_en: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none bg-gray-50 focus:bg-white transition-colors" />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                          <button onClick={handleTranslateFaqEdit} disabled={translatingFaq}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-40">
                            {translatingFaq ? <RefreshCw size={13} className="animate-spin" /> : <Languages size={14} />}
                            🇦🇱 → 🇬🇧
                          </button>
                          <div className="flex-1" />
                          <button onClick={() => saveFaqEdit(faq.id)} disabled={savingFaq}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors disabled:opacity-50">
                            {savingFaq ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />} Ruaj Ndryshimet
                          </button>
                          <button onClick={() => setEditingFaqId(null)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">Anulo</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-stretch">
                      {/* Order controls */}
                      <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-5 bg-gray-50 border-r border-gray-100 shrink-0">
                        <button onClick={() => moveFaq(faq, "up")} disabled={idx === 0}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-20 transition-colors">
                          <ChevronUp size={15} />
                        </button>
                        <div className="w-7 h-7 rounded-lg bg-[#c0231e]/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#c0231e]">{idx + 1}</span>
                        </div>
                        <button onClick={() => moveFaq(faq, "down")} disabled={idx === arr.length - 1}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-20 transition-colors">
                          <ChevronDown size={15} />
                        </button>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0 px-6 py-5 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 leading-snug">{faq.q_en || faq.q_sq}</p>
                          <p className="text-sm text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{faq.a_en || faq.a_sq}</p>
                          <div className="flex gap-1.5 mt-3">
                            {faq.q_sq && <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">🇦🇱 SQ</span>}
                            {faq.q_en && <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">🇬🇧 EN</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                          <button onClick={() => { setEditingFaqId(faq.id); setFaqEdits({}); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-[#c0231e]/10 hover:text-[#c0231e] transition-colors">
                            <Edit2 size={12} /> Ndrysho
                          </button>
                          <button onClick={() => deleteFaqItem(faq.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                            <Trash2 size={12} /> Fshi
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Empty state */}
              {faqs.length === 0 && !addingFaq && (
                <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={22} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-semibold mb-1">Asnjë pyetje akoma</p>
                  <p className="text-gray-400 text-sm">Klikoni &quot;Shto Pyetje&quot; për të shtuar të parën.</p>
                </div>
              )}
            </div>
          )}
          </div>
        </main>
      )}

      {/* ══════════════ SETTINGS TAB ══════════════ */}
      {tab === "settings" && (
        <main className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto space-y-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Cilësimet</h2>
            <p className="text-sm text-gray-400 mt-0.5">Menaxho orarin, njoftime dhe sigurinë e llogarisë.</p>
          </div>

          {/* ── Opening Hours ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Orari i Punës</p>
                <p className="text-white/50 text-xs mt-0.5">Shfaqet në faqen e Kontaktit dhe Footer</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🇦🇱 E Hënë–E Premte (Shqip)</label>
                  <input value={hours.weekdays_sq} onChange={(e) => setHours((p) => ({ ...p, weekdays_sq: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🇬🇧 Monday–Friday (English)</label>
                  <input value={hours.weekdays_en} onChange={(e) => setHours((p) => ({ ...p, weekdays_en: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🇦🇱 E Shtunë (Shqip)</label>
                  <input value={hours.saturday_sq} onChange={(e) => setHours((p) => ({ ...p, saturday_sq: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🇬🇧 Saturday (English)</label>
                  <input value={hours.saturday_en} onChange={(e) => setHours((p) => ({ ...p, saturday_en: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                </div>
              </div>
              {hoursMsg && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border ${hoursMsg.type === "ok" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                  {hoursMsg.type === "ok" ? <Check size={15} /> : <X size={15} />} {hoursMsg.text}
                </div>
              )}
              <button onClick={handleSaveHours} disabled={savingHours}
                className="w-full py-3 bg-[#c0231e] text-white text-sm font-bold rounded-xl hover:bg-[#9a1c18] transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                {savingHours ? <RefreshCw size={15} className="animate-spin" /> : <Check size={15} />}
                {savingHours ? "Duke ruajtur..." : "Ruaj Orarin"}
              </button>
            </div>
          </div>

          {/* ── Announcement Bar ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Njoftim në krye të faqes</p>
                <p className="text-white/50 text-xs mt-0.5">Baneri shfaqet në çdo faqe nëse është aktiv</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Active toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Aktivizo Njoftimin</p>
                  <p className="text-xs text-gray-400 mt-0.5">Banerit do të shfaqet në krye të faqes</p>
                </div>
                <button
                  onClick={() => setAnn((p) => ({ ...p, active: !p.active }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${ann.active ? "bg-[#c0231e]" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${ann.active ? "translate-x-6" : ""}`} />
                </button>
              </div>

              {/* Background color */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Ngjyra e Sfondit</label>
                <div className="flex gap-3">
                  {([["red", "bg-[#c0231e]", "E Kuqe"], ["dark", "bg-[#1a1a1a]", "E Zezë"], ["yellow", "bg-amber-400", "Amber"]] as const).map(([val, cls, label]) => (
                    <button key={val} onClick={() => setAnn((p) => ({ ...p, bg: val }))}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${ann.bg === val ? "border-[#c0231e] scale-105" : "border-transparent bg-gray-100 text-gray-600 hover:border-gray-300"}`}>
                      <span className={`w-4 h-4 rounded-full ${cls}`} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🇦🇱 Teksti (Shqip)</label>
                  <input value={ann.text_sq} onChange={(e) => setAnn((p) => ({ ...p, text_sq: e.target.value }))}
                    placeholder="p.sh. Ofertë speciale – 10% zbritje!"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">🇬🇧 Text (English)</label>
                  <input value={ann.text_en} onChange={(e) => setAnn((p) => ({ ...p, text_en: e.target.value }))}
                    placeholder="e.g. Special offer – 10% discount!"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors" />
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Lidhja (opsionale)</label>
                <input value={ann.link ?? ""} onChange={(e) => setAnn((p) => ({ ...p, link: e.target.value || undefined }))}
                  placeholder="p.sh. /contact ose https://..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors font-mono" />
              </div>

              {/* Preview */}
              {(ann.text_sq || ann.text_en) && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 pt-3 pb-2">Pamja paraprake</p>
                  <div className={`py-2.5 px-4 text-center text-sm font-semibold relative ${ann.bg === "red" ? "bg-[#c0231e] text-white" : ann.bg === "dark" ? "bg-[#1a1a1a] text-white" : "bg-amber-400 text-[#1a1a1a]"}`}>
                    {ann.text_sq || ann.text_en}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60"><X size={14} /></span>
                  </div>
                </div>
              )}

              {annMsg && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border ${annMsg.type === "ok" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                  {annMsg.type === "ok" ? <Check size={15} /> : <X size={15} />} {annMsg.text}
                </div>
              )}
              <button onClick={handleSaveAnnouncement} disabled={savingAnn}
                className="w-full py-3 bg-[#c0231e] text-white text-sm font-bold rounded-xl hover:bg-[#9a1c18] transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                {savingAnn ? <RefreshCw size={15} className="animate-spin" /> : <Check size={15} />}
                {savingAnn ? "Duke ruajtur..." : "Ruaj Njoftimin"}
              </button>
            </div>
          </div>

          {/* ── Password ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Ndrysho Fjalëkalimin</p>
                <p className="text-white/50 text-xs mt-0.5">Fjalëkalimi ruhet i enkriptuar me bcrypt</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Fjalëkalimi Aktual</label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? "text" : "password"}
                    value={currentPwd}
                    onChange={(e) => { setCurrentPwd(e.target.value); setPwdMsg(null); }}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                  <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Fjalëkalimi i Ri</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    value={newPwd}
                    onChange={(e) => { setNewPwd(e.target.value); setPwdMsg(null); }}
                    placeholder="Minimum 8 karaktere"
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPwd.length > 0 && newPwd.length < 8 && (
                  <p className="text-xs text-amber-500 mt-1.5 font-medium">Të paktën 8 karaktere të nevojshme</p>
                )}
                {newPwd.length >= 8 && (
                  <p className="text-xs text-green-500 mt-1.5 font-medium flex items-center gap-1"><Check size={11} /> Gjatësia e mjaftueshme</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Konfirmo Fjalëkalimin e Ri</label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    value={confirmPwd}
                    onChange={(e) => { setConfirmPwd(e.target.value); setPwdMsg(null); }}
                    onKeyDown={(e) => e.key === "Enter" && handlePasswordChange()}
                    placeholder="Ripërsërit fjalëkalimin e ri"
                    className={`w-full pl-4 pr-11 py-3 rounded-xl border focus:outline-none text-sm transition-colors ${
                      confirmPwd && confirmPwd !== newPwd
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : confirmPwd && confirmPwd === newPwd && newPwd.length >= 8
                        ? "border-green-300 bg-green-50 focus:border-green-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#c0231e] focus:bg-white"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPwd && confirmPwd !== newPwd && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"><X size={11} /> Fjalëkalimet nuk përputhen</p>
                )}
                {confirmPwd && confirmPwd === newPwd && newPwd.length >= 8 && (
                  <p className="text-xs text-green-500 mt-1.5 font-medium flex items-center gap-1"><Check size={11} /> Fjalëkalimet përputhen</p>
                )}
              </div>

              {pwdMsg && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border ${
                  pwdMsg.type === "ok"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-red-50 text-red-600 border-red-100"
                }`}>
                  {pwdMsg.type === "ok" ? <Check size={15} /> : <X size={15} />}
                  {pwdMsg.text}
                </div>
              )}

              <button
                onClick={handlePasswordChange}
                disabled={savingPwd || !currentPwd || !newPwd || !confirmPwd || newPwd !== confirmPwd || newPwd.length < 8}
                className="w-full py-3 bg-[#c0231e] text-white text-sm font-bold rounded-xl hover:bg-[#9a1c18] transition-colors disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
              >
                {savingPwd ? <RefreshCw size={15} className="animate-spin" /> : <Lock size={15} />}
                {savingPwd ? "Duke ruajtur..." : "Ndrysho Fjalëkalimin"}
              </button>
            </div>
          </div>

          </div>
        </main>
      )}

      {/* ── Delete confirmation modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Fshi {selected.size} foto?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Kjo do të fshijë përgjithmonë fotot e zgjedhura nga faqja. Ky veprim <span className="font-semibold text-gray-700">nuk mund të kthehet mbrapsht</span>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingSelected}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Anulo
              </button>
              <button
                onClick={deleteSelected}
                disabled={deletingSelected}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingSelected ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deletingSelected ? "Duke fshirë..." : "Po, fshi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
