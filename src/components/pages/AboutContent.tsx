"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { Award, Users, Globe, Wrench, X, ZoomIn } from "lucide-react";
import type { SiteImage } from "@/types";

const timelineSQ = [
  { year: "1994", title: "Themeluar në Tiranë", desc: "Tenda Era u themelua me një vizion për të sjellë zgjidhje profesionale hijeje në tregun shqiptar." },
  { year: "2000s", title: "Partneritete Ndërkombëtare", desc: "U bëmë përfaqësuesi ekskluziv shqiptar për Corti, Calbari, Mehler dhe Frigerio." },
  { year: "2010s", title: "Zgjerim në të gjithë Shqipërinë", desc: "Qindra projekte të përfunduara në Tiranë, Durrës, Vlorë, Sarandë dhe qytetet kryesore." },
  { year: "Sot", title: "Lider i Tregut", desc: "Me mbi 30 vjet eksperiencë, Tenda Era mbetet kompania kryesore e tendave dhe çadrave të diellit në vend." },
];
const timelineEN = [
  { year: "1994", title: "Founded in Tirana", desc: "Tenda Era was established with a vision to bring professional shade solutions to the Albanian market." },
  { year: "2000s", title: "International Partnerships", desc: "Became the exclusive Albanian representative for Corti, Calbari, Mehler and Frigerio." },
  { year: "2010s", title: "Expanding Across Albania", desc: "Hundreds of completed projects across Tirana, Durrës, Vlorë, Sarandë, and all major cities." },
  { year: "Today", title: "Market Leader", desc: "With 30+ years of experience, Tenda Era remains Albania's premier sun awning and shade structure company." },
];

const valuesSQ = [
  { icon: Award, title: "Cilësia Mbi Gjithçka", desc: "Ne përdorim vetëm materiale dhe pajisje europiane të certifikuara — pa kompromise në qëndrueshmëri apo finiturë." },
  { icon: Users, title: "Ekip Ekspert", desc: "Montuesit tanë janë trajnuar drejtpërdrejt nga prodhuesit partnerë dhe janë të certifikuar për çdo sistem." },
  { icon: Globe, title: "Standarde Europiane", desc: "Të gjitha produktet tona plotësojnë standardet e BE-së për siguri e cilësi dhe janë të mbuluara nga garancia e prodhuesit." },
  { icon: Wrench, title: "Shërbim i Plotë", desc: "Nga dizajni dhe prodhimi deri te montimi dhe mirëmbajtja e vazhdueshme — kujdesemi për gjithçka." },
];
const valuesEN = [
  { icon: Award, title: "Quality First", desc: "We only use certified European materials and hardware — no compromises on durability or finish." },
  { icon: Users, title: "Expert Team", desc: "Our installers are trained directly by partner manufacturers and certified for every system." },
  { icon: Globe, title: "European Standards", desc: "All our products meet EU safety and quality standards, backed by manufacturer warranties." },
  { icon: Wrench, title: "Full Service", desc: "From design and fabrication to installation and ongoing maintenance — we handle it all." },
];

const partnersSQ = [
  { name: "Corti", country: "Itali", desc: "Specialistë në sisteme tendash tërheqëse të nivelit të lartë." },
  { name: "Calbari", country: "Itali", desc: "Prodhues kryesor i sistemeve komerciale të kanopeve dhe pergolave." },
  { name: "Mehler", country: "Gjermani", desc: "Pëlhura teknike të klasit botëror për tenda dhe struktura tensile." },
  { name: "Frigerio", country: "Itali", desc: "Zgjidhje premium hijeje dhe strehimi të jashtëm." },
];
const partnersEN = [
  { name: "Corti", country: "Italy", desc: "Specialists in high-end retractable awning systems." },
  { name: "Calbari", country: "Italy", desc: "Leading manufacturer of commercial canopy and pergola systems." },
  { name: "Mehler", country: "Germany", desc: "World-class technical fabrics for awnings and tensile structures." },
  { name: "Frigerio", country: "Italy", desc: "Premium outdoor shade and shelter solutions." },
];

interface Props {
  images: SiteImage[];
}

export default function AboutContent({ images }: Props) {
  const { lang, t } = useLang();
  const a = t.about_page;
  const timeline = lang === "sq" ? timelineSQ : timelineEN;
  const values = lang === "sq" ? valuesSQ : valuesEN;
  const partners = lang === "sq" ? partnersSQ : partnersEN;
  const [lightbox, setLightbox] = useState<SiteImage | null>(null);
  const galleryImages = images.slice(1);

  return (
    <>
      <section className="relative pt-36 pb-24 px-6 overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#dc2626]/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#ef4444]/10 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="inline-flex items-center gap-2 text-[#ef4444] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <span className="w-6 h-px bg-[#ef4444]" />
            {a.label}
            <span className="w-6 h-px bg-[#ef4444]" />
          </p>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">{a.title}</h1>
          <p className="text-white/65 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">{a.desc}</p>
        </div>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 right-0 w-full h-16 block">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1350,50 1440,30 L1440,80 L0,80 Z" fill="#faf7f2" />
        </svg>
      </section>

      {/* Story */}
      <section className="bg-[#faf7f2] py-20 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[#dc2626] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-[#dc2626]" />
              {a.story_label}
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight leading-[1.1]">{a.story_title}</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>{a.story_p1}</p>
              <p>{a.story_p2}</p>
              <p>{a.story_p3}</p>
            </div>
          </div>
          <div className="rounded-3xl h-96 relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
            {images[0] ? (
              <>
                <Image src={images[0].url} alt={images[0].title || "Rreth Nesh"} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, #dc2626 0, #dc2626 1px, transparent 0, transparent 50%)`, backgroundSize: "24px 24px" }} />
                <div className="text-center absolute inset-0 flex items-center justify-center p-8">
                  <div>
                    <p className="font-display text-7xl font-bold text-[#dc2626]">30+</p>
                    <p className="text-white/60 text-lg mt-2">{lang === "sq" ? "Vjet Përsosmërie" : "Years of Excellence"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="inline-flex items-center gap-2 text-[#dc2626] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-[#dc2626]" />
              {a.values_label}
              <span className="w-6 h-px bg-[#dc2626]" />
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">{a.values_title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="p-7 rounded-2xl border border-neutral-200 bg-white hover:border-[#dc2626]/30 hover:shadow-soft transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fef2f2] to-[#fecaca] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <v.icon size={22} className="text-[#dc2626]" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 tracking-tight">{v.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="bg-[#faf7f2] py-20 lg:py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="inline-flex items-center gap-2 text-[#dc2626] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                <span className="w-6 h-px bg-[#dc2626]" />
                {lang === "sq" ? "Galeri" : "Gallery"}
                <span className="w-6 h-px bg-[#dc2626]" />
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
                {lang === "sq" ? "Momente nga Ne" : "Moments From Us"}
              </h2>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer shadow-soft hover:shadow-elevated transition-shadow ring-1 ring-neutral-200"
                  onClick={() => setLightbox(img)}
                >
                  <Image
                    src={img.url}
                    alt=""
                    width={600}
                    height={400}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={90}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all group-hover:scale-100 scale-90">
                      <ZoomIn className="text-neutral-900" size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#dc2626] transition-colors touch-manipulation"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt=""
              width={1200}
              height={800}
              sizes="90vw"
              quality={100}
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      <section className={`${galleryImages.length > 0 ? "bg-white" : "bg-[#faf7f2]"} py-20 lg:py-24 px-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="inline-flex items-center gap-2 text-[#dc2626] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-[#dc2626]" />
              {a.timeline_label}
              <span className="w-6 h-px bg-[#dc2626]" />
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">{a.timeline_title}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#dc2626]/60 via-[#dc2626]/25 to-transparent" />
            <div className="space-y-10">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-8 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#dc2626] to-[#b91c1c] border-4 border-[#faf7f2] flex items-center justify-center z-10 relative shadow-lg shadow-[#dc2626]/30">
                      <span className="text-white font-bold text-xs text-center leading-tight">{item.year}</span>
                    </div>
                  </div>
                  <div className="pb-4 pt-3 flex-1">
                    <h3 className="font-display text-xl lg:text-2xl font-semibold text-neutral-900 mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-neutral-950 py-20 lg:py-24 px-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#dc2626]/12 blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#ef4444]/8 blur-[110px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-14">
            <p className="inline-flex items-center gap-2 text-[#ef4444] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-[#ef4444]" />
              {a.partners_label}
              <span className="w-6 h-px bg-[#ef4444]" />
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight">{a.partners_title}</h2>
            <p className="text-white/55 mt-4 max-w-xl mx-auto leading-relaxed">{a.partners_desc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {partners.map((p) => (
              <div key={p.name} className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:border-[#dc2626]/40 hover:bg-white/[0.06] transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dc2626]/25 to-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-[#ef4444] font-bold">{p.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-white tracking-tight">{p.name}</p>
                    <p className="text-white/45 text-[11px] uppercase tracking-widest font-semibold">{p.country}</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
