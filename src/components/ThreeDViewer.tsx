"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { X, RotateCcw } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ThreeDViewer({ src, alt, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const s = useRef({ rx: -10, ry: 15, dragging: false, lx: 0, ly: 0, spin: true, raf: 0 });

  const applyTransform = () => {
    if (cardRef.current)
      cardRef.current.style.transform = `rotateX(${s.current.rx}deg) rotateY(${s.current.ry}deg)`;
  };

  useEffect(() => {
    const tick = () => {
      if (s.current.spin) { s.current.ry += 0.25; applyTransform(); }
      s.current.raf = requestAnimationFrame(tick);
    };
    s.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.current.raf);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      s.current.spin = false;
      s.current.dragging = true;
      s.current.lx = e.touches[0].clientX;
      s.current.ly = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!s.current.dragging) return;
      const dx = e.touches[0].clientX - s.current.lx;
      const dy = e.touches[0].clientY - s.current.ly;
      s.current.lx = e.touches[0].clientX;
      s.current.ly = e.touches[0].clientY;
      s.current.ry += dx * 0.5;
      s.current.rx = Math.max(-70, Math.min(70, s.current.rx - dy * 0.5));
      applyTransform();
    };
    const onTouchEnd = () => { s.current.dragging = false; };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    s.current.spin = false;
    s.current.dragging = true;
    s.current.lx = e.clientX;
    s.current.ly = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!s.current.dragging) return;
    const dx = e.clientX - s.current.lx;
    const dy = e.clientY - s.current.ly;
    s.current.lx = e.clientX;
    s.current.ly = e.clientY;
    s.current.ry += dx * 0.5;
    s.current.rx = Math.max(-70, Math.min(70, s.current.rx - dy * 0.5));
    applyTransform();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
      style={{ background: "radial-gradient(ellipse at center, #1c1c1c 0%, #000 100%)" }}
      onMouseMove={onMouseMove}
      onMouseUp={() => { s.current.dragging = false; }}
      onMouseLeave={() => { s.current.dragging = false; }}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-[#c0231e] transition-colors z-10"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      <button
        className="absolute top-4 left-4 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs uppercase tracking-widest"
        onClick={() => { s.current.spin = true; s.current.rx = -10; }}
      >
        <RotateCcw size={14} /> Auto-spin
      </button>

      <div style={{ perspective: "1200px" }}>
        <div
          ref={cardRef}
          style={{
            width: "min(500px, 88vw)",
            aspectRatio: "4/3",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: "rotateX(-10deg) rotateY(15deg)",
            cursor: "grab",
          }}
          onMouseDown={onMouseDown}
        >
          {/* Front face */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
          }}>
            <Image src={src} alt={alt} fill className="object-cover" draggable={false} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none",
              background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 55%)",
            }} />
          </div>
          {/* Back face */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#c0231e", fontSize: 34, fontFamily: "Georgia, serif", fontWeight: 700 }}>Tenda Era</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 8, letterSpacing: "0.25em", textTransform: "uppercase" }}>Quality Since 1997</div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 text-white/30 text-xs tracking-[0.2em] uppercase">Drag to rotate</p>
    </div>
  );
}
