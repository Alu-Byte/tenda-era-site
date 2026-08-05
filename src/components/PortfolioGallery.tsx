"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import type { SiteImage } from "@/types";

const placeholders = [
  { title: "Beach Club Canopy", location: "Durrës", tall: true },
  { title: "Restaurant Awning", location: "Tirana", tall: false },
  { title: "Shop Facade", location: "Shkodër", tall: false },
  { title: "Hotel Pool Umbrellas", location: "Sarandë", tall: true },
  { title: "Bar Terrace", location: "Vlorë", tall: false },
  { title: "Street Canopy", location: "Berat", tall: false },
  { title: "Rooftop Pergola", location: "Tirana", tall: true },
  { title: "Cafe Awning", location: "Gjirokastër", tall: false },
  { title: "Marina Shade", location: "Vlorë", tall: false },
];

interface Props {
  images: SiteImage[];
}

export default function PortfolioGallery({ images }: Props) {
  const [lightbox, setLightbox] = useState<SiteImage | null>(null);

  if (images.length > 0) {
    return (
      <>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer shadow-soft hover:shadow-elevated transition-shadow ring-1 ring-neutral-200"
              onClick={() => setLightbox(img)}
            >
              <Image
                src={img.url}
                alt=""
                width={600}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={90}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all group-hover:scale-100 scale-90">
                  <ZoomIn className="text-neutral-900" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {lightbox && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-[#e11d3c] transition-colors touch-manipulation"
              onClick={() => setLightbox(null)}
            >
              <X size={32} />
            </button>
            <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={lightbox.url}
                alt=""
                width={1200}
                height={800}
                sizes="90vw"
                quality={100}
                className="max-h-[85vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="mb-8 p-5 bg-white border border-[#e11d3c]/20 rounded-2xl flex items-start gap-4 shadow-soft">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fef2f4] to-[#fce7ea] flex items-center justify-center shrink-0">
          <span className="text-[#e11d3c] text-lg">💡</span>
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed pt-1">
          Portfolio images are managed from the{" "}
          <a href="/admin" className="text-[#e11d3c] font-semibold underline">Admin Panel</a>.
          Upload your project photos and assign them to &quot;Portfolio&quot; to display them here.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {placeholders.map((p, i) => (
          <div
            key={i}
            className={`break-inside-avoid rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-end p-6 relative ring-1 ring-white/5 ${
              p.tall ? "h-80" : "h-52"
            }`}
          >
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #f43f5e 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10">
              <p className="text-white font-semibold text-sm">{p.title}</p>
              <p className="text-white/50 text-xs mt-0.5">📍 {p.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
