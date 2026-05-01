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
              className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer"
              onClick={() => setLightbox(img)}
            >
              <Image
                src={img.url}
                alt={img.title || img.originalName}
                width={600}
                height={400}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
              </div>
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold text-sm">{img.title}</p>
                  {img.description && <p className="text-white/60 text-xs">{img.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>

        {lightbox && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-[#c0231e] transition-colors touch-manipulation"
              onClick={() => setLightbox(null)}
            >
              <X size={32} />
            </button>
            <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={lightbox.url}
                alt={lightbox.title || lightbox.originalName}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain rounded-xl"
              />
              {lightbox.title && (
                <div className="mt-3 text-center">
                  <p className="text-white font-semibold">{lightbox.title}</p>
                  {lightbox.description && <p className="text-white/60 text-sm">{lightbox.description}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="mb-8 p-4 bg-[#c0231e]/10 border border-[#c0231e]/30 rounded-2xl flex items-center gap-3">
        <span className="text-[#c0231e] text-xl">💡</span>
        <p className="text-sm text-[#2d2d2d]/70">
          Portfolio images are managed from the{" "}
          <a href="/admin" className="text-[#c0231e] font-semibold underline">Admin Panel</a>.
          Upload your project photos and assign them to &quot;Portfolio&quot; to display them here.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {placeholders.map((p, i) => (
          <div
            key={i}
            className={`break-inside-avoid rounded-2xl overflow-hidden bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] flex items-end p-6 relative ${
              p.tall ? "h-80" : "h-52"
            }`}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #c0231e 0, #c0231e 1px, transparent 0, transparent 50%)`,
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
