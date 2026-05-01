"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload, Trash2, Eye, EyeOff, LogOut, RefreshCw,
  Image as ImageIcon, LayoutGrid,
  ChevronUp, ChevronDown, Edit2, Check, X, Package, Plus,
} from "lucide-react";
import type { SiteImage, Category, Subcategory } from "@/types";

const FIXED_SECTIONS = [
  { value: "hero", label: "Hero (Homepage)" },
  { value: "portfolio", label: "Portfolio" },
  { value: "about", label: "About Page" },
];

type Tab = "images" | "products";

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

  useEffect(() => { fetchImages(); fetchProducts(); }, []);

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
    if (!confirm("Delete this image permanently?")) return;
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
    if (!confirm("Delete this subcategory and all its images?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubcategories((prev) => prev.filter((s) => s.id !== id));
    setImages((prev) => prev.filter((img) => img.section !== id));
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
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-white/60 hover:text-white text-xs flex items-center gap-1 transition-colors">
            <LayoutGrid size={14} /> View Site
          </a>
          <button onClick={logout} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 flex">
        <button onClick={() => setTab("images")} className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === "images" ? "border-[#c0231e] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          <ImageIcon size={16} /> Photos
        </button>
        <button onClick={() => setTab("products")} className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === "products" ? "border-[#c0231e] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          <Package size={16} /> Products
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 flex gap-8">

        {/* ══════════════ IMAGES TAB ══════════════ */}
        {tab === "images" && (
          <>
            {/* Sidebar */}
            <aside className="w-52 shrink-0 hidden lg:block">
              <nav className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-3">Filter</p>
                {[{ value: "all", label: `All (${images.length})` }, ...FIXED_SECTIONS].map((s) => (
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Upload to Section</label>
                    <select value={uploadSection} onChange={(e) => setUploadSection(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm text-gray-700">
                      {allSections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Title (optional)</label>
                    <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Beach Club Canopy"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                  </div>
                </div>
                <div className="text-center">
                  <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-1">
                    Drag & drop, or{" "}
                    <button onClick={() => fileRef.current?.click()} className="text-[#c0231e] font-semibold hover:underline">browse files</button>
                  </p>
                  <p className="text-gray-400 text-xs">JPG, PNG, WebP — multiple supported</p>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                  {uploading && <div className="mt-3 flex items-center justify-center gap-2 text-[#c0231e]"><RefreshCw size={16} className="animate-spin" /><span className="text-sm">Uploading...</span></div>}
                </div>
              </div>

              {/* Mobile filter pills */}
              <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {[{ value: "all", label: "All" }, ...allSections].map((s) => (
                  <button key={s.value} onClick={() => setFilterSection(s.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterSection === s.value ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-600">{filtered.length} image{filtered.length !== 1 ? "s" : ""}{filterSection !== "all" && <span className="font-normal text-gray-400"> · {sectionLabel(filterSection)}</span>}</p>
                <button onClick={fetchImages} className="text-gray-400 hover:text-gray-600 p-1"><RefreshCw size={15} /></button>
              </div>

              {loadingImgs ? (
                <div className="flex items-center justify-center py-24 text-gray-300"><RefreshCw size={24} className="animate-spin" /></div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <ImageIcon size={40} className="text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No images here yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filtered.map((img) => (
                    <div key={img.id} className={`bg-white rounded-2xl overflow-hidden border transition-all ${!img.visible ? "opacity-50 border-gray-200" : "border-gray-100 hover:border-[#c0231e]/50 hover:shadow-md"}`}>
                      <div className="relative aspect-square bg-gray-100">
                        <Image src={img.url} alt={img.title || img.filename} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                          <button onClick={() => toggleVisible(img)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#c0231e] hover:text-white transition-colors">{img.visible ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                          <button onClick={() => startImgEdit(img)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-colors"><Edit2 size={15} /></button>
                          <button onClick={() => deleteImg(img.id)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={15} /></button>
                        </div>
                        {!img.visible && <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff size={10} /> Hidden</div>}
                      </div>
                      <div className="p-3">
                        {editingImgId === img.id ? (
                          <div className="space-y-2">
                            <input value={editImgTitle} onChange={(e) => setEditImgTitle(e.target.value)} placeholder="Title" className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:border-[#c0231e] focus:outline-none" />
                            <select value={editImgSection} onChange={(e) => setEditImgSection(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:border-[#c0231e] focus:outline-none">
                              {allSections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            <div className="flex gap-1.5">
                              <button onClick={() => saveImgEdit(img.id)} className="flex-1 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-lg flex items-center justify-center gap-1"><Check size={11} /> Save</button>
                              <button onClick={() => setEditingImgId(null)} className="flex-1 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg flex items-center justify-center gap-1"><X size={11} /> Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-semibold text-gray-700 truncate">{img.title || img.originalName}</p>
                            <p className="text-xs text-[#c0231e] mt-0.5 truncate">{sectionLabel(img.section)}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex gap-0.5">
                                <button onClick={() => changeOrder(img, "up")} className="p-1 text-gray-300 hover:text-gray-600"><ChevronUp size={14} /></button>
                                <button onClick={() => changeOrder(img, "down")} className="p-1 text-gray-300 hover:text-gray-600"><ChevronDown size={14} /></button>
                              </div>
                              <p className="text-gray-300 text-xs">{new Date(img.uploadedAt).toLocaleDateString()}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </>
        )}

        {/* ══════════════ PRODUCTS TAB ══════════════ */}
        {tab === "products" && (
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Product Categories</h2>
              <p className="text-sm text-gray-400 mt-1">Add, edit or remove subcategories under each main category. These appear on the Products page.</p>
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
                      <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a]">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <p className="font-display text-lg font-semibold text-white">{cat.name_sq}</p>
                            <p className="text-white/50 text-xs">{cat.name_en}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setAddingTo(isAdding ? null : cat.id); setNewSub({ name_sq: "", name_en: "", desc_sq: "", desc_en: "" }); }}
                          className="flex items-center gap-2 px-4 py-2 bg-[#c0231e] text-white text-sm font-semibold rounded-xl hover:bg-[#9a1c18] transition-colors"
                        >
                          <Plus size={15} /> Add Subcategory
                        </button>
                      </div>

                      {/* Add subcategory form */}
                      {isAdding && (
                        <div className="px-6 py-5 bg-[#c0231e]/5 border-b border-[#c0231e]/20">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">New Subcategory</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇦🇱 Name (Albanian) *</label>
                              <input value={newSub.name_sq} onChange={(e) => setNewSub((p) => ({ ...p, name_sq: e.target.value }))}
                                placeholder="p.sh. Tendë Tërheqëse" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇬🇧 Name (English) *</label>
                              <input value={newSub.name_en} onChange={(e) => setNewSub((p) => ({ ...p, name_en: e.target.value }))}
                                placeholder="e.g. Retractable Awning" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇦🇱 Description (Albanian)</label>
                              <textarea rows={2} value={newSub.desc_sq} onChange={(e) => setNewSub((p) => ({ ...p, desc_sq: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">🇬🇧 Description (English)</label>
                              <textarea rows={2} value={newSub.desc_en} onChange={(e) => setNewSub((p) => ({ ...p, desc_en: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => addSubcategory(cat.id)} disabled={savingSub || (!newSub.name_sq && !newSub.name_en)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors disabled:opacity-50">
                              {savingSub ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />} Add
                            </button>
                            <button onClick={() => setAddingTo(null)} className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Subcategory list */}
                      {subs.length === 0 && !isAdding ? (
                        <div className="px-6 py-10 text-center text-gray-400 text-sm">No subcategories yet. Click "Add Subcategory" to create one.</div>
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
                                        <label className="block text-xs text-gray-400 mb-1">🇦🇱 Name</label>
                                        <input value={subEdits.name_sq ?? sub.name_sq} onChange={(e) => setSubEdits((p) => ({ ...p, name_sq: e.target.value }))}
                                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🇬🇧 Name</label>
                                        <input value={subEdits.name_en ?? sub.name_en} onChange={(e) => setSubEdits((p) => ({ ...p, name_en: e.target.value }))}
                                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🇦🇱 Description</label>
                                        <textarea rows={2} value={subEdits.desc_sq ?? sub.desc_sq} onChange={(e) => setSubEdits((p) => ({ ...p, desc_sq: e.target.value }))}
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">🇬🇧 Description</label>
                                        <textarea rows={2} value={subEdits.desc_en ?? sub.desc_en} onChange={(e) => setSubEdits((p) => ({ ...p, desc_en: e.target.value }))}
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#c0231e] focus:outline-none text-sm resize-none" />
                                      </div>
                                    </div>
                                    <div className="flex gap-3">
                                      <button onClick={() => saveSubEdit(sub.id)} disabled={savingSub}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors disabled:opacity-50">
                                        {savingSub ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />} Save
                                      </button>
                                      <button onClick={() => setEditingSubId(null)} className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl">Cancel</button>
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
                                            {imgCount} photo{imgCount !== 1 ? "s" : ""}
                                          </span>
                                        )}
                                      </div>
                                      {sub.desc_en && <p className="text-sm text-gray-400 leading-relaxed">{sub.desc_en}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button onClick={() => { setEditingSubId(sub.id); setSubEdits({}); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-[#c0231e] transition-colors">
                                        <Edit2 size={12} /> Edit
                                      </button>
                                      <button onClick={() => deleteSub(sub.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                                        <Trash2 size={12} /> Delete
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
    </div>
  );
}
