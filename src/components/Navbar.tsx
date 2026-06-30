"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import AnnouncementBar from "@/components/AnnouncementBar";

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

  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const atTop = false;
  const navBg = "bg-white shadow-md";
  const textColor = "#1a1a1a";

  return (
    <>
      {/* ── Navbar bar ─────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000, transition: "background 0.3s" }}>
        <AnnouncementBar />
        <div className={navBg} style={{ maxWidth: "100%" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", minWidth: 0 }}>
            <Image src="/logo.png" alt="Tenda Era" width={40} height={35} style={{ objectFit: "contain", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.18))", flexShrink: 0 }} priority />
            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 15, fontWeight: 700, color: textColor, whiteSpace: "nowrap" }}>
              Tenda <span style={{ color: "#c0231e" }}>Era</span>
            </span>
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: 24 }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", textDecoration: "none", color: pathname === link.href ? "#c0231e" : textColor }}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" style={{ padding: "9px 20px", background: "#c0231e", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 999, textDecoration: "none" }}>
              {t.nav.quote}
            </Link>
            <div style={{ display: "flex", gap: 2, border: `1px solid ${atTop ? "rgba(255,255,255,0.4)" : "#e5e5e5"}`, borderRadius: 999, padding: "3px 4px" }}>
              {(["sq", "en"] as const).map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)}
                  style={{ padding: "5px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", borderRadius: 999, border: "none", cursor: "pointer", background: lang === l ? "#c0231e" : "transparent", color: lang === l ? "#fff" : textColor }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden" style={{ alignItems: "center", gap: 4 }}>
            {(["sq", "en"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)}
                style={{ minWidth: 44, minHeight: 44, padding: "0 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", borderRadius: 999, border: "none", cursor: "pointer", touchAction: "manipulation", background: lang === l ? "#c0231e" : "transparent", color: lang === l ? "#fff" : textColor }}>
                {l.toUpperCase()}
              </button>
            ))}
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu"
              style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", touchAction: "manipulation" }}>
              <Menu size={26} color={textColor} />
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ─────────────────────────────────── */}
      {open && (
        <>
          {/* Dimmed backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9001, background: "rgba(0,0,0,0.5)" }}
          />

          {/* Slide-in panel */}
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(300px, 85vw)", zIndex: 9002, background: "#fff", display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0,0,0,0.15)" }}>

            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Image src="/logo.png" alt="Tenda Era" width={36} height={32} style={{ objectFit: "contain", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" }} />
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
                  Tenda <span style={{ color: "#c0231e" }}>Era</span>
                </span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"
                style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", touchAction: "manipulation" }}>
                <X size={22} color="#1a1a1a" />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, overflowY: "auto" }}>
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  style={{ display: "block", padding: "16px 20px", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #f5f5f5", color: pathname === link.href ? "#c0231e" : "#1a1a1a", textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bottom actions */}
            <div style={{ padding: 20, borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {(["sq", "en"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setLang(l)}
                    style={{ flex: 1, padding: "12px 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", borderRadius: 12, border: "none", cursor: "pointer", touchAction: "manipulation", background: lang === l ? "#c0231e" : "#f3f4f6", color: lang === l ? "#fff" : "#1a1a1a" }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <Link href="/contact" onClick={() => setOpen(false)}
                style={{ display: "block", padding: 15, background: "#c0231e", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 14, textAlign: "center", textDecoration: "none" }}>
                {t.nav.quote}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
