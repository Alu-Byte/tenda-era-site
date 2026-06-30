"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ModelViewer({ src, alt, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const mv = document.createElement("model-viewer");
    mv.setAttribute("src", src);
    mv.setAttribute("alt", alt);
    mv.setAttribute("auto-rotate", "");
    mv.setAttribute("camera-controls", "");
    mv.setAttribute("shadow-intensity", "1.2");
    mv.setAttribute("exposure", "0.9");
    mv.setAttribute("environment-image", "neutral");
    mv.style.width = "100%";
    mv.style.height = "100%";
    mv.style.background = "transparent";
    el.appendChild(mv);
    return () => { el.innerHTML = ""; };
  }, [src, alt]);

  return (
    <>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        type="module"
        strategy="lazyOnload"
      />
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, #1c1c1c 0%, #080808 100%)" }}
        onClick={onClose}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-[#c0231e] transition-colors z-10"
          onClick={onClose}
        >
          <X size={32} />
        </button>
        <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs uppercase tracking-[0.2em] whitespace-nowrap">
          3D Model · drag to rotate · scroll to zoom
        </p>

        <div
          ref={containerRef}
          style={{ width: "min(560px, 92vw)", height: "min(560px, 74vh)" }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </>
  );
}
