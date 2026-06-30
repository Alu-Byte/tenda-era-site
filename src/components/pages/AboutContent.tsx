"use client";

import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { Award, Users, Globe, Wrench } from "lucide-react";
import type { SiteImage } from "@/types";

const timelineSQ = [
  { year: "1994", title: "Themeluar në Tiranë", desc: "Tenda Era u themelua me një vizion për të sjellë zgjidhje profesionale hije në tregun shqiptar." },
  { year: "2000s", title: "Partneritete Ndërkombëtare", desc: "U bë përfaqësuesi ekskluziv shqiptar për Corti, Calbari, Mehler dhe Frigerio." },
  { year: "2010s", title: "Zgjerim në të gjithë Shqipërinë", desc: "Qindra projekte të përfunduara në Tiranë, Durrës, Vlorë, Sarandë dhe qytete kryesore." },
  { year: "Sot", title: "Lider i Tregut", desc: "Me mbi 30 vjet eksperiencë, Tenda Era mbetet kompania kryesore e tendave dhe çadrajave të diellit." },
];
const timelineEN = [
  { year: "1994", title: "Founded in Tirana", desc: "Tenda Era was established with a vision to bring professional shade solutions to the Albanian market." },
  { year: "2000s", title: "International Partnerships", desc: "Became the exclusive Albanian representative for Corti, Calbari, Mehler and Frigerio." },
  { year: "2010s", title: "Expanding Across Albania", desc: "Hundreds of completed projects across Tirana, Durrës, Vlorë, Sarandë, and all major cities." },
  { year: "Today", title: "Market Leader", desc: "With 30+ years of experience, Tenda Era remains Albania's premier sun awning and shade structure company." },
];

const valuesSQ = [
  { icon: Award, title: "Cilësia Para Gjithash", desc: "Ne përdorim vetëm materiale dhe pajisje europiane të certifikuara." },
  { icon: Users, title: "Ekip Ekspert", desc: "Instaluesit tanë janë trajnuar drejtpërdrejt nga prodhuesit partnerë." },
  { icon: Globe, title: "Standarde Europiane", desc: "Të gjitha produktet tona plotësojnë standardet BE të sigurisë dhe cilësisë." },
  { icon: Wrench, title: "Shërbim i Plotë", desc: "Nga dizajni dhe fabrikimi deri tek instalimi dhe mirëmbajtja e vazhdueshme." },
];
const valuesEN = [
  { icon: Award, title: "Quality First", desc: "We only use certified European materials and hardware — no compromises on durability or finish." },
  { icon: Users, title: "Expert Team", desc: "Our installers are trained directly by partner manufacturers and certified for every system." },
  { icon: Globe, title: "European Standards", desc: "All our products meet EU safety and quality standards, backed by manufacturer warranties." },
  { icon: Wrench, title: "Full Service", desc: "From design and fabrication to installation and ongoing maintenance — we handle it all." },
];

const partnersSQ = [
  { name: "Corti", country: "Itali", desc: "Specialistë në sisteme tende tërheqëse të larta." },
  { name: "Calbari", country: "Itali", desc: "Prodhues kryesor i sistemeve komerciale kanopi dhe pergole." },
  { name: "Mehler", country: "Gjermani", desc: "Pëlhura teknike të klasit botëror për tendave dhe struktura tensile." },
  { name: "Frigerio", country: "Itali", desc: "Zgjidhje premium të hijes dhe strehimit të jashtëm." },
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

  return (
    <>
      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{a.label}</p>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">{a.title}</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{a.desc}</p>
        </div>
      </section>

      <div className="bg-[#1a1a1a] h-12 relative">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#faf8f4]" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </div>

      {/* Story */}
      <section className="bg-[#faf8f4] py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{a.story_label}</p>
            <h2 className="font-display text-4xl font-bold text-[#1a1a1a] mb-6">{a.story_title}</h2>
            <div className="space-y-4 text-[#2d2d2d]/70 leading-relaxed">
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
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, #c0231e 0, #c0231e 1px, transparent 0, transparent 50%)`, backgroundSize: "24px 24px" }} />
                <div className="text-center absolute inset-0 flex items-center justify-center p-8">
                  <div>
                    <p className="font-display text-7xl font-bold text-[#c0231e]">30+</p>
                    <p className="text-white/60 text-lg mt-2">{lang === "sq" ? "Vjet Sipërsie" : "Years of Excellence"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{a.values_label}</p>
            <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">{a.values_title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-7 rounded-2xl border border-[#e5e5e5] hover:border-[#c0231e] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-[#c0231e]/10 flex items-center justify-center mb-5 group-hover:bg-[#c0231e]/20 transition-colors">
                  <v.icon size={22} className="text-[#c0231e]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">{v.title}</h3>
                <p className="text-sm text-[#2d2d2d]/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#faf8f4] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{a.timeline_label}</p>
            <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">{a.timeline_title}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#e5e5e5]" />
            <div className="space-y-10">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-8 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#c0231e] border-4 border-[#faf8f4] flex items-center justify-center z-10 relative">
                      <span className="text-white font-bold text-xs text-center leading-tight">{item.year}</span>
                    </div>
                  </div>
                  <div className="pb-4 pt-3">
                    <h3 className="font-display text-xl font-semibold text-[#1a1a1a] mb-2">{item.title}</h3>
                    <p className="text-[#2d2d2d]/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-[#1a1a1a] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{a.partners_label}</p>
            <h2 className="font-display text-4xl font-bold text-white">{a.partners_title}</h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto">{a.partners_desc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((p) => (
              <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-[#c0231e]/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#c0231e]/20 flex items-center justify-center">
                    <span className="text-[#c0231e] font-bold">{p.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">{p.name}</p>
                    <p className="text-white/40 text-xs">{p.country}</p>
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
