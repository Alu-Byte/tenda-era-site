"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/LangContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  // Always solid — on homepage at top we do a dark semi-transparent;
  // once scrolled or on any other page, full white with shadow.
  const atTop = isHome && !scrolled;
  const navBg = atTop
    ? "bg-black/50 backdrop-blur-md"
    : "bg-white shadow-md";
  const textColor = atTop ? "text-white" : "text-[#1a1a1a]";
  const activeColor = atTop ? "text-[#c0231e]" : "text-[#c0231e]";
  const borderColor = atTop ? "border-white/30" : "border-gray-200";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-18 md:h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 py-2">
          <Image
            src="/logo.jpg"
            alt="Tenda Era"
            width={54}
            height={48}
            className="object-contain rounded-sm"
            priority
          />
          <span className={`font-display text-lg font-bold tracking-wide hidden sm:block ${atTop ? "text-white" : "text-[#1a1a1a]"}`}>
            Tenda <span className="text-[#c0231e]">Era</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-200 relative group ${
                pathname === link.href ? activeColor : `${textColor} hover:text-[#c0231e]`
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#c0231e] transition-all duration-300 ${
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}

          {/* Lang switcher */}
          <div className={`flex items-center border rounded-full overflow-hidden ${borderColor}`}>
            <button
              onClick={() => setLang("sq")}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors touch-manipulation ${
                lang === "sq" ? "bg-[#c0231e] text-white" : `${textColor} opacity-70 hover:opacity-100`
              }`}
            >SQ</button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors touch-manipulation ${
                lang === "en" ? "bg-[#c0231e] text-white" : `${textColor} opacity-70 hover:opacity-100`
              }`}
            >EN</button>
          </div>

          <Link
            href="/contact"
            className="px-5 py-2.5 bg-[#c0231e] text-white text-sm font-semibold rounded-full hover:bg-[#9a1c18] active:bg-[#9a1c18] transition-colors"
          >
            {t.nav.quote}
          </Link>
        </nav>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-2">
          {/* Lang switcher */}
          <div className={`flex items-center border rounded-full overflow-hidden ${borderColor}`}>
            <button
              onClick={() => setLang("sq")}
              className={`px-3 py-2 text-xs font-bold uppercase transition-colors touch-manipulation min-w-[40px] ${
                lang === "sq" ? "bg-[#c0231e] text-white" : `${textColor} opacity-70`
              }`}
            >SQ</button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-2 text-xs font-bold uppercase transition-colors touch-manipulation min-w-[40px] ${
                lang === "en" ? "bg-[#c0231e] text-white" : `${textColor} opacity-70`
              }`}
            >EN</button>
          </div>
          <button
            className={`p-2.5 touch-manipulation rounded-lg ${textColor}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — full dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        open ? "max-h-screen" : "max-h-0"
      } bg-white border-t border-gray-100 shadow-lg`}>
        <nav className="flex flex-col divide-y divide-gray-100">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-6 py-4 text-sm font-semibold tracking-wide uppercase touch-manipulation active:bg-gray-50 ${
                pathname === link.href ? "text-[#c0231e]" : "text-[#1a1a1a]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 py-5">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block w-full py-4 bg-[#c0231e] text-white text-sm font-semibold rounded-2xl text-center touch-manipulation active:bg-[#9a1c18]"
            >
              {t.nav.quote}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
