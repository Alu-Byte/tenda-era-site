"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const navBg = scrolled
    ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]"
    : "bg-white/75 backdrop-blur-lg";

  return (
    <>
      {/* ── Navbar bar ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-[9000]">
        <AnnouncementBar />
        <div className={`${navBg} transition-all duration-300 border-b border-neutral-100/60`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 min-w-0 no-underline group">
              <Image
                src="/logo.png"
                alt="Tenda Era"
                width={38}
                height={34}
                className="object-contain flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}
                priority
              />
              <span className="text-[15px] font-bold text-neutral-900 whitespace-nowrap tracking-[0.02em] uppercase">
                Tenda <span className="text-[#0f766e]">Era</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-[13px] font-semibold tracking-wide rounded-lg transition-all no-underline
                      ${active
                        ? "text-[#0f766e]"
                        : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/70"}`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#0f766e]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right cluster */}
            <div className="hidden md:flex items-center gap-3">
              {/* Lang toggle */}
              <div className="flex items-center bg-neutral-100/80 rounded-full p-0.5">
                {(["sq", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all
                      ${lang === l
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-800"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {/* CTA */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f766e] text-white text-[12px] font-bold uppercase tracking-wider no-underline hover:bg-[#115e59] transition-colors"
              >
                <Phone size={13} strokeWidth={2.5} />
                {t.nav.quote}
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-1">
              {(["sq", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-label={`Switch to ${l.toUpperCase()}`}
                  className={`min-w-[38px] h-11 px-2 text-[11px] font-bold uppercase rounded-full transition-colors touch-manipulation
                    ${lang === l ? "bg-[#0f766e] text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
                >
                  {l}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors touch-manipulation ml-0.5"
              >
                <Menu size={24} className="text-neutral-900" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ─────────────────────────────────── */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9001] bg-black/40 backdrop-blur-sm animate-fade-in"
          />
          <div className="fixed top-0 right-0 bottom-0 z-[9002] bg-white flex flex-col shadow-2xl animate-scale-in"
            style={{ width: "min(320px, 88vw)" }}>

            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="Tenda Era" width={34} height={30} className="object-contain"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }} />
                <span className="text-lg font-bold text-neutral-900 tracking-[0.02em] uppercase">
                  Tenda <span className="text-[#0f766e]">Era</span>
                </span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors touch-manipulation">
                <X size={22} className="text-neutral-900" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                    className={`flex items-center px-5 py-4 text-sm font-semibold tracking-wide no-underline transition-colors
                      ${active
                        ? "text-[#0f766e] bg-[#0f766e]/5 border-l-4 border-[#0f766e]"
                        : "text-neutral-800 border-l-4 border-transparent hover:bg-neutral-50"}`}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-neutral-100 flex flex-col gap-3">
              <div className="flex items-center bg-neutral-100 rounded-full p-1">
                {(["sq", "en"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setLang(l)}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all touch-manipulation
                      ${lang === l ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <Link href="/contact" onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-3.5 bg-[#0f766e] text-white text-sm font-semibold rounded-full no-underline hover:bg-[#115e59] transition-colors touch-manipulation shadow-lg shadow-[#0f766e]/30">
                <Phone size={14} /> {t.nav.quote}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
