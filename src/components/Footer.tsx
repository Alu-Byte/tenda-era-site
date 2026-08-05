"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { useSiteInfo } from "@/lib/useSiteInfo";

export default function Footer() {
  const { lang, t } = useLang();
  const f = t.footer;
  const nav = t.nav;
  const { openingHours } = useSiteInfo();

  return (
    <footer className="bg-neutral-950 text-white relative overflow-hidden">
      {/* Soft accent glow */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-[#a03e14]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 relative">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.jpg" alt="Tenda Era" width={40} height={36} className="object-contain rounded-md" />
            <span className="font-display text-xl font-bold tracking-tight">Tenda <span className="text-[#a03e14]">Era</span></span>
          </div>
          <p className="text-white/55 text-sm leading-relaxed mb-6">{f.desc}</p>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/profile.php?id=61585040403719" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a03e14] hover:border-[#a03e14] transition-all touch-manipulation">
              <FacebookIcon size={16} />
            </a>
            <a href="https://www.instagram.com/cadra.tenda.erashpk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a03e14] hover:border-[#a03e14] transition-all touch-manipulation">
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-tight mb-5">{f.nav_title}</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            {[
              { href: "/", label: nav.home },
              { href: "/products", label: nav.products },
              { href: "/portfolio", label: nav.portfolio },
              { href: "/about", label: nav.about },
              { href: "/contact", label: nav.contact },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-1.5 hover:text-white transition-colors group no-underline">
                  <span className="w-0 group-hover:w-3 h-px bg-[#a03e14] transition-all" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-tight mb-5">{f.products_title}</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            {[
              { href: "/products#tenda", label: lang === "sq" ? "Tenda" : "Awnings" },
              { href: "/products#cadra", label: lang === "sq" ? "Çadra" : "Umbrellas" },
            ].map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="inline-flex items-center gap-1.5 hover:text-white transition-colors group no-underline">
                  <span className="w-0 group-hover:w-3 h-px bg-[#a03e14] transition-all" />
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-tight mb-5">{f.contact_title}</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin size={16} className="text-[#a03e14] mt-0.5 shrink-0" />
              <span className="flex flex-col gap-0.5 leading-relaxed">
                <span>Era shpk Prush Vaqarr Rruga Green Line km 1, Tiranë</span>
                <span>Rr. &quot;Muhedin Llagani&quot;, Tiranë</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="text-[#a03e14] mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <a href="tel:+355692075317" className="hover:text-white transition-colors">+355 69 207 5317</a>
                <a href="tel:+355692075318" className="hover:text-white transition-colors">+355 69 207 5318</a>
                <a href="tel:+355692075319" className="hover:text-white transition-colors">+355 69 207 5319</a>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="text-[#a03e14] mt-0.5 shrink-0" />
              <a href="mailto:info@tendaera.com" className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                info@tendaera.com
                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="text-[#a03e14] mt-0.5 shrink-0" />
              <span className="flex flex-col gap-0.5 leading-relaxed">
                <span>{lang === "sq" ? openingHours.weekdays_sq : openingHours.weekdays_en}</span>
                <span>{lang === "sq" ? openingHours.saturday_sq : openingHours.saturday_en}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/40 text-xs">
          <span>© {new Date().getFullYear()} Tenda Era. {f.rights}</span>
          <span>{f.established}</span>
        </div>
      </div>
    </footer>
  );
}
