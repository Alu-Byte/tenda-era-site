"use client";

import { useLang } from "@/lib/LangContext";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock, Sparkles, ArrowUpRight, MessageCircle, Send } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { useSiteInfo } from "@/lib/useSiteInfo";
import Reveal from "@/components/Reveal";

export default function ContactContent() {
  const { lang, t } = useLang();
  const c = t.contact_page;
  const { openingHours } = useSiteInfo();

  const infoItems = [
    {
      icon: MapPin,
      label: c.address,
      value: 'Era shpk Prush Vaqarr Rruga Green Line km 1, Tiranë\nRr. "Muhedin Llagani", Tiranë',
      href: null as string | null,
    },
    {
      icon: Phone,
      label: c.phone,
      value: "+355 69 207 5317 / 5318 / 5319",
      href: "tel:+355692075317",
    },
    {
      icon: Mail,
      label: c.email,
      value: "info@tendaera.com",
      href: "mailto:info@tendaera.com",
    },
    {
      icon: Clock,
      label: c.hours,
      value: `${lang === "sq" ? openingHours.weekdays_sq : openingHours.weekdays_en}\n${lang === "sq" ? openingHours.saturday_sq : openingHours.saturday_en}`,
      href: null as string | null,
    },
  ];

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
                  {c.label}
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-7xl xl:text-[6rem] font-bold leading-[0.95] tracking-tight animate-fade-up"
                style={{ animationDelay: "0.08s", opacity: 0, animationFillMode: "forwards" }}
              >
                {c.title}
              </h1>
              <p
                className="mt-6 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed animate-fade-up"
                style={{ animationDelay: "0.18s", opacity: 0, animationFillMode: "forwards" }}
              >
                {c.desc}
              </p>
            </div>

            <div
              className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10 animate-fade-up"
              style={{ animationDelay: "0.28s", opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-5">
                <HeroStat n="1" label={lang === "sq" ? "Ditë përgjigje" : "Day response"} />
                <HeroStat n="03" label={lang === "sq" ? "Linja tel." : "Phone lines"} />
                <HeroStat n="1994" label={lang === "sq" ? "Prej" : "Since"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ QUICK ACTIONS STRIP ═══════════════════════ */}
      <section className="bg-white border-b border-[#e3ddd1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            <QuickAction
              icon={Phone}
              label={lang === "sq" ? "Telefono" : "Call Us"}
              value="+355 69 207 5317/8/9"
              href="tel:+355692075317"
            />
            <QuickAction
              icon={MessageCircle}
              label="WhatsApp"
              value={lang === "sq" ? "Përgjigje e shpejtë" : "Fast reply"}
              href="https://wa.me/355692075317"
              external
            />
            <QuickAction
              icon={Mail}
              label="Email"
              value="info@tendaera.com"
              href="mailto:info@tendaera.com"
            />
            <QuickAction
              icon={Send}
              label={lang === "sq" ? "Formulari" : "Send a Message"}
              value={lang === "sq" ? "Poshtë në faqe" : "Below on this page"}
              href="#contact-form"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CONTACT INFO + FORM ═══════════════════════ */}
      <section className="bg-[#faf7f2] py-20 lg:py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: contact info */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">01</span>
                  <span className="w-10 h-px bg-[#dc2626]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
                    {lang === "sq" ? "Detaje kontakti" : "Contact details"}
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1c1917] tracking-tight leading-[1.05]">
                  {c.story_title}
                </h2>
              </div>
            </Reveal>

            {/* Info cards — uniform 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-8">
              {infoItems.map((item, i) => (
                <Reveal key={item.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="h-full">
                  <InfoCard item={item} />
                </Reveal>
              ))}
            </div>

            {/* Social */}
            <Reveal>
              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#57534e] mb-3">
                  {c.follow}
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://www.facebook.com/profile.php?id=61585040403719"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e3ddd1] rounded-full text-sm font-semibold text-[#1c1917] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors no-underline"
                  >
                    <FacebookIcon size={15} /> Facebook
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a
                    href="https://www.instagram.com/cadra.tenda.erashpk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e3ddd1] rounded-full text-sm font-semibold text-[#1c1917] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors no-underline"
                  >
                    <InstagramIcon size={15} /> Instagram
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Map */}
            <Reveal>
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-[#e3ddd1] shadow-soft h-64 lg:h-72 bg-[#292524]">
                <iframe
                  src="https://maps.google.com/maps?q=Era+shpk+Prush+Vaqarr+Rruga+Green+Line+km+1,+Tirana,+Albania&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Era shpk location"
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.16em] text-[#1c1917] shadow pointer-events-none">
                  <MapPin size={11} className="text-[#dc2626]" />
                  {lang === "sq" ? "Na gjeni këtu" : "Find us here"}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <div id="contact-form" className="lg:col-span-6 lg:sticky lg:top-24 self-start scroll-mt-24">
            <Reveal delay={2}>
              <div className="mb-6 lg:hidden">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[13px] font-mono font-bold text-[#dc2626] tabular-nums">02</span>
                  <span className="w-10 h-px bg-[#dc2626]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#57534e]">
                    {lang === "sq" ? "Formulari" : "Form"}
                  </span>
                </div>
              </div>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────── Presentational ─────────── */

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

function QuickAction({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  const externalProps = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      {...externalProps}
      className="group relative flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-[#faf7f2] border border-[#e3ddd1] hover:border-[#dc2626]/40 hover:bg-white hover:shadow-elevated transition-all no-underline overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#dc2626]/0 group-hover:bg-[#dc2626]/10 blur-2xl transition-colors duration-500" />
      <div className="relative w-11 h-11 rounded-xl bg-white border border-[#e3ddd1] flex items-center justify-center shrink-0 group-hover:bg-[#dc2626] group-hover:border-[#dc2626] transition-colors">
        <Icon size={18} className="text-[#dc2626] group-hover:text-white transition-colors" />
      </div>
      <div className="relative min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dc2626]">{label}</p>
        <p className="text-sm font-semibold text-[#1c1917] mt-0.5 truncate">{value}</p>
      </div>
      <ArrowUpRight
        size={14}
        className="relative text-[#a8a29e] group-hover:text-[#dc2626] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
      />
    </a>
  );
}

interface InfoItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href: string | null;
}

function InfoCard({ item }: { item: InfoItem }) {
  const inner = (
    <>
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#dc2626]/0 group-hover:bg-[#dc2626]/10 blur-2xl transition-colors duration-500" />
      <div className="relative flex flex-col h-full">
        <div className="w-11 h-11 rounded-xl bg-[#faf7f2] border border-[#e3ddd1] flex items-center justify-center mb-4 group-hover:border-[#dc2626] group-hover:bg-[#fef2f2] transition-colors">
          <item.icon size={18} className="text-[#dc2626]" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a8a29e] mb-1.5">
          {item.label}
        </p>
        <p className="text-[#1c1917] text-sm font-semibold whitespace-pre-line leading-relaxed group-hover:text-[#dc2626] transition-colors">
          {item.value}
        </p>
      </div>
    </>
  );
  const cls = "group relative h-full p-5 lg:p-6 rounded-2xl bg-white border border-[#e3ddd1] hover:border-[#dc2626]/40 hover:shadow-elevated transition-all overflow-hidden";
  return item.href ? (
    <a href={item.href} className={`${cls} no-underline block`}>{inner}</a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
