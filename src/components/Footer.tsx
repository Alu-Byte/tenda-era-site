"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { useSiteInfo } from "@/lib/useSiteInfo";

export default function Footer() {
  const { lang, t } = useLang();
  const f = t.footer;
  const nav = t.nav;
  const { openingHours } = useSiteInfo();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.jpg" alt="Tenda Era" width={40} height={36} className="object-contain rounded-sm" />
            <span className="font-display text-xl font-semibold">Tenda <span className="text-[#c0231e]">Era</span></span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
          <div className="flex gap-3 mt-6">
            <a href="https://www.facebook.com/profile.php?id=61585040403719" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c0231e] hover:text-[#c0231e] transition-colors touch-manipulation">
              <FacebookIcon size={16} />
            </a>
            <a href="https://www.instagram.com/cadra.tenda.erashpk/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c0231e] hover:text-[#c0231e] transition-colors touch-manipulation">
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[#c0231e] font-semibold text-sm uppercase tracking-widest mb-5">{f.nav_title}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {[
              { href: "/", label: nav.home },
              { href: "/products", label: nav.products },
              { href: "/portfolio", label: nav.portfolio },
              { href: "/about", label: nav.about },
              { href: "/contact", label: nav.contact },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-[#c0231e] font-semibold text-sm uppercase tracking-widest mb-5">{f.products_title}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {[
              { href: "/products#tenda", label: lang === "sq" ? "Tenda" : "Awnings" },
              { href: "/products#cadra", label: lang === "sq" ? "Çadra" : "Umbrellas" },
            ].map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-white transition-colors">{p.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#c0231e] font-semibold text-sm uppercase tracking-widest mb-5">{f.contact_title}</h4>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin size={16} className="text-[#c0231e] mt-0.5 shrink-0" />
              <span className="flex flex-col gap-0.5">
                <span>Era shpk Prush Vaqarr Rruga Green Line km 1, Tiranë, Albania</span>
                <span>Rr. &quot;Muhedin Llagani&quot;, Tiranë, Shqipëri</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="text-[#c0231e] mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <a href="tel:+355692075317" className="hover:text-white transition-colors">+355 692 075 317</a>
                <a href="tel:+355692075318" className="hover:text-white transition-colors">+355 692 075 318</a>
                <a href="tel:+355692075319" className="hover:text-white transition-colors">+355 692 075 319</a>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="text-[#c0231e] mt-0.5 shrink-0" />
              <a href="mailto:info@tendaera.com" className="hover:text-white transition-colors">info@tendaera.com</a>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="text-[#c0231e] mt-0.5 shrink-0" />
              <span className="flex flex-col gap-0.5">
                <span>{lang === "sq" ? openingHours.weekdays_sq : openingHours.weekdays_en}</span>
                <span>{lang === "sq" ? openingHours.saturday_sq : openingHours.saturday_en}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/40 text-xs">
          <span>© {new Date().getFullYear()} Tenda Era. {f.rights}</span>
          <span>{f.established}</span>
        </div>
      </div>
    </footer>
  );
}
