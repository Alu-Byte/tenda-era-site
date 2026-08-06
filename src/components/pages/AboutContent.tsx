"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import {
  Award, Users, Globe, Wrench, X, ZoomIn,
  Sparkles, ArrowUpRight, Phone, Calendar, MapPin, Handshake, Hammer,
} from "lucide-react";
import type { SiteImage } from "@/types";
import Reveal from "@/components/Reveal";

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
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden text-white bg-black">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 700px at 50% 15%, rgba(255,255,255,0.05), transparent 65%)",
          }}
        />
        <div className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-[#dc2626]/12 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-[#991b1b]/12 blur-[120px] pointer-events-none" />
        <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pointer-events-none select-none pr-4 lg:pr-10 overflow-hidden">
          <span
            className="font-bold tracking-[-0.04em] leading-none whitespace-nowrap text-white/[0.035]"
            style={{ fontSize: "clamp(140px, 22vw, 340px)" }}
          >
            1994
          </span>
        </div>
        <div className="absolute top-24 right-6 lg:right-10 hidden md:block pointer-events-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/25">
            Est. · Since 1994
          </p>
        </div>
        <div className="absolute inset-0 grain" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #dc2626 50%, transparent)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-16 lg:pt-44 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6 animate-fade-up">
                <Sparkles size={13} className="text-[#fca5a5]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#fca5a5]">
                  {a.label}
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-7xl xl:text-[6rem] font-bold leading-[0.95] tracking-tight animate-fade-up"
                style={{ animationDelay: "0.08s", opacity: 0, animationFillMode: "forwards" }}
              >
                {a.title}
              </h1>
              <p
                className="mt-6 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed animate-fade-up"
                style={{ animationDelay: "0.18s", opacity: 0, animationFillMode: "forwards" }}
              >
                {a.desc}
              </p>
            </div>

            <div
              className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10 animate-fade-up"
              style={{ animationDelay: "0.28s", opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-5">
                <HeroStat n="30+" label={lang === "sq" ? "Vjet Eksperiencë" : "Years"} />
                <HeroStat n="04" label={lang === "sq" ? "Partnerë EU" : "EU Partners"} />
                <HeroStat n="500+" label={lang === "sq" ? "Instalime" : "Installations"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HIGHLIGHTS STRIP ═══════════════════════ */}
      <section className="bg-white border-b border-[#e3ddd1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <NumberHighlight
              icon={Calendar}
              n="1994"
              label={lang === "sq" ? "Themeluar" : "Founded"}
              sub={lang === "sq" ? "Tiranë, Shqipëri" : "Tirana, Albania"}
            />
            <NumberHighlight
              icon={Handshake}
              n="04"
              label={lang === "sq" ? "Partnerë EU" : "EU Partners"}
              sub={lang === "sq" ? "Corti · Calbari · Mehler · Frigerio" : "Corti · Calbari · Mehler · Frigerio"}
            />
            <NumberHighlight
              icon={Hammer}
              n="500+"
              label={lang === "sq" ? "Instalime" : "Installations"}
              sub={lang === "sq" ? "Në 3 dekada" : "Across 3 decades"}
            />
            <NumberHighlight
              icon={MapPin}
              n="12+"
              label={lang === "sq" ? "Qytete" : "Cities"}
              sub={lang === "sq" ? "Në të gjithë vendin" : "Nationwide reach"}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STORY ═══════════════════════ */}
      <section className="bg-[#faf7f2] py-20 lg:py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <Reveal className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">01</span>
              <span className="w-10 h-px bg-[#dc2626]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
                {a.story_label}
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1c1917] tracking-tight leading-[1.02] mb-8">
              {a.story_title}
            </h2>
            <div className="space-y-5 text-[#57534e] text-base lg:text-lg leading-relaxed">
              <p>{a.story_p1}</p>
              <p>{a.story_p2}</p>
              <p>{a.story_p3}</p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={2}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated ring-1 ring-[#e3ddd1]">
              {images[0] ? (
                <>
                  <Image
                    src={images[0].url}
                    alt={images[0].title || "About"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={90}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0808] via-[#0c0a09] to-[#160a08] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 22px)",
                    }}
                  />
                  <div className="absolute -top-24 -right-24 w-[360px] h-[360px] rounded-full bg-[#dc2626]/35 blur-[110px]" />
                  <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full bg-[#991b1b]/40 blur-[100px]" />
                  <div className="absolute inset-0 grain" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center relative z-10">
                      <p className="text-8xl lg:text-9xl font-bold text-white tracking-tight tabular-nums">
                        30<span className="text-[#fca5a5]">+</span>
                      </p>
                      <p className="text-white/70 text-lg mt-3 font-semibold tracking-wide">
                        {lang === "sq" ? "Vjet Përsosmërie" : "Years of Excellence"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute top-5 left-5 flex items-center gap-2 text-white/85 text-[10px] font-bold uppercase tracking-widest z-10">
                <span className="w-6 h-px bg-white/50" />
                {lang === "sq" ? "Që nga 1994" : "Since 1994"}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════ VALUES ═══════════════════════ */}
      <section className="bg-white py-20 lg:py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-12 lg:mb-16 flex items-end justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">02</span>
                  <span className="w-10 h-px bg-[#dc2626]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
                    {a.values_label}
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1c1917] tracking-tight leading-[1.02]">
                  {a.values_title}
                </h2>
              </div>
              <p className="text-[#57534e] text-sm lg:text-base max-w-sm">
                {lang === "sq"
                  ? "Katër shtylla që përcaktojnë çdo projekt që marrim përsipër."
                  : "Four pillars that define every project we take on."}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="group relative h-full p-7 lg:p-8 rounded-2xl bg-[#faf7f2] border border-[#e3ddd1] hover:border-[#dc2626]/40 hover:bg-white hover:shadow-elevated transition-all overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#dc2626]/0 group-hover:bg-[#dc2626]/10 blur-2xl transition-colors duration-500" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[11px] font-mono font-bold text-[#dc2626] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="w-6 h-px bg-[#dc2626]" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#e3ddd1] flex items-center justify-center mb-5 group-hover:border-[#dc2626] group-hover:bg-[#fef2f2] transition-colors">
                      <v.icon size={22} className="text-[#dc2626]" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-[#1c1917] tracking-tight mb-3 leading-tight">
                      {v.title}
                    </h3>
                    <p className="text-sm text-[#57534e] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TIMELINE ═══════════════════════ */}
      <section className="bg-[#faf7f2] py-20 lg:py-28 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-14 lg:mb-20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">03</span>
                <span className="w-10 h-px bg-[#dc2626]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
                  {a.timeline_label}
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1c1917] tracking-tight leading-[1.02]">
                {a.timeline_title}
              </h2>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute left-8 lg:left-10 top-2 bottom-2 w-px bg-gradient-to-b from-[#dc2626]/60 via-[#dc2626]/25 to-transparent" />
            <div className="space-y-10 lg:space-y-14">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="flex gap-6 lg:gap-10 items-start">
                    <div className="shrink-0 relative">
                      <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full bg-white border-2 border-[#dc2626] flex items-center justify-center shadow-soft relative z-10">
                        <span className="text-[#dc2626] font-bold text-xs lg:text-sm text-center leading-tight px-1">
                          {item.year}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 pt-3">
                      <h3 className="text-2xl lg:text-3xl font-bold text-[#1c1917] tracking-tight leading-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[#57534e] text-base lg:text-lg leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ GALLERY ═══════════════════════ */}
      {galleryImages.length > 0 && (
        <section className="bg-white py-20 lg:py-28 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="mb-12 lg:mb-14 flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">04</span>
                    <span className="w-10 h-px bg-[#dc2626]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
                      {lang === "sq" ? "Galeri" : "Gallery"}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1c1917] tracking-tight leading-[1.02]">
                    {lang === "sq" ? "Momente nga Ne" : "Moments From Us"}
                  </h2>
                </div>
                <p className="text-[#57534e] text-sm tabular-nums">
                  {String(galleryImages.length).padStart(2, "0")}{" "}
                  {lang === "sq" ? "foto" : "photos"}
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-[280px] lg:auto-rows-[320px]">
              {galleryImages.map((img, i) => (
                <Reveal key={img.id} delay={((i % 3) + 1) as 1 | 2 | 3} className="h-full">
                  <button
                    type="button"
                    onClick={() => setLightbox(img)}
                    className="group relative w-full h-full rounded-2xl overflow-hidden bg-[#292524] p-0 border-0 cursor-pointer shadow-soft hover:shadow-elevated transition-shadow"
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-[#dc2626]/0 group-hover:bg-[#dc2626]/15 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                        <ZoomIn size={18} className="text-[#1c1917]" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-white/80 tracking-widest tabular-nums flex items-center gap-2">
                      <span className="w-4 h-px bg-white/50" />
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[90] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors z-10"
            onClick={() => setLightbox(null)}
            aria-label={lang === "sq" ? "Mbylle" : "Close"}
          >
            <X size={22} />
          </button>
          <div className="max-w-6xl max-h-[92vh] relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt=""
              className="max-h-[92vh] max-w-full w-auto h-auto object-contain rounded-xl animate-fade-in"
            />
          </div>
        </div>
      )}

      {/* ═══════════════════════ PARTNERS ═══════════════════════ */}
      <section className="bg-[#0c0a09] py-20 lg:py-28 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] rounded-full bg-[#dc2626]/20 blur-[110px] pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-12 lg:mb-16 flex items-end justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[13px] font-mono font-bold text-[#fca5a5] tabular-nums">05</span>
                  <span className="w-10 h-px bg-[#fca5a5]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#fca5a5]">
                    {a.partners_label}
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.02]">
                  {a.partners_title}
                </h2>
              </div>
              <p className="text-white/60 text-sm lg:text-base max-w-sm">{a.partners_desc}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {partners.map((p, i) => (
              <Reveal key={p.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="group relative h-full p-7 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-[#dc2626]/50 hover:bg-white/[0.07] transition-all overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#dc2626]/0 group-hover:bg-[#dc2626]/25 blur-2xl transition-colors duration-500" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#dc2626]/30 to-[#dc2626]/10 border border-[#dc2626]/40 flex items-center justify-center text-[#fca5a5] font-bold text-lg group-hover:scale-110 transition-transform">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white tracking-tight">{p.name}</p>
                        <p className="text-[#fca5a5]/70 text-[10px] uppercase tracking-widest font-bold">
                          {p.country}
                        </p>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ BOTTOM CTA ═══════════════════════ */}
      <section className="bg-white py-20 lg:py-24 px-6 lg:px-10 relative overflow-hidden border-t border-[#e3ddd1]">
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <Reveal className="lg:col-span-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#dc2626] mb-4 flex items-center gap-3">
                <span className="w-10 h-px bg-[#dc2626]" />
                {lang === "sq" ? "Le të bashkëpunojmë" : "Let's work together"}
              </p>
              <h3 className="text-3xl lg:text-5xl font-bold text-[#1c1917] leading-[1.1] tracking-tight max-w-3xl mb-4">
                {lang === "sq"
                  ? "Nga vizioni te instalimi — ne kujdesemi për çdo hap."
                  : "From vision to installation — we handle every step."}
              </h3>
              <p className="text-[#57534e] text-base lg:text-lg leading-relaxed max-w-2xl">
                {lang === "sq"
                  ? "Bisedoni me ekipin tonë për të kuptuar se si mund t'ju ndihmojmë me projektin tuaj të ardhshëm."
                  : "Talk to our team to see how we can help with your next project."}
              </p>
            </Reveal>
            <Reveal className="lg:col-span-4 flex flex-col gap-3 lg:items-end" delay={2}>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[#991b1b] transition-colors no-underline w-full lg:w-auto shadow-lg shadow-[#dc2626]/40 animate-pulse-glow"
              >
                {lang === "sq" ? "Na Kontaktoni" : "Contact Us"}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="tel:+355692075317"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-[#e3ddd1] text-[#1c1917] text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-[#faf7f2] transition-colors no-underline w-full lg:w-auto"
              >
                <Phone size={16} /> +355 69 207 5317/8/9
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────── Presentational ─────────── */

function NumberHighlight({
  icon: Icon,
  n,
  label,
  sub,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  n: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#dc2626]" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl lg:text-3xl font-bold text-[#1c1917] tracking-tight tabular-nums leading-none">
          {n}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dc2626] mt-1.5">
          {label}
        </p>
        <p className="text-[11px] text-[#57534e] mt-1 leading-snug truncate">{sub}</p>
      </div>
    </div>
  );
}

function HeroStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-3xl lg:text-4xl font-bold tracking-tight tabular-nums text-white">
        {n}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 mt-1">
        {label}
      </span>
    </div>
  );
}
