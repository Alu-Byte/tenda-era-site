"use client";

import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import type { SiteImage } from "@/types";

interface Props {
  images: SiteImage[];
}

export default function PortfolioGallery({ images }: Props) {
  const [lightbox, setLightbox] = useState<SiteImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="p-8 bg-white border border-[#e3ddd1] rounded-2xl text-center">
        <p className="text-sm text-[#57534e]">
          No portfolio images yet.{" "}
          <a href="/admin" className="text-[#a03e14] font-semibold underline">Upload some from the admin panel.</a>
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry via CSS columns. Photos flow at their natural aspect ratio so nothing gets cropped. */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5 [&>*]:mb-4 lg:[&>*]:mb-5">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightbox(img)}
            className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer shadow-soft hover:shadow-elevated transition-shadow ring-1 ring-[#e3ddd1] block w-full p-0 bg-transparent"
          >
            {/* Plain <img> — Cloudinary already serves WebP + auto-quality, and we
                want each photo at its native aspect ratio inside the masonry. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt=""
              loading="lazy"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all group-hover:scale-100 scale-90">
                <ZoomIn className="text-neutral-900" size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/92 z-[9999] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors touch-manipulation"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <div className="max-w-6xl max-h-[92vh] relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt=""
              className="max-h-[92vh] max-w-full w-auto h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
