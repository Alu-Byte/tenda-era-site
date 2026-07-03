"use client";

import { useState } from "react";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://wa.me/355692075317"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 group"
    >
      {/* Pulse ring */}
      <span className="absolute right-0 bottom-0 w-14 h-14 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
      {/* Tooltip */}
      <span className={`absolute right-16 bottom-2 whitespace-nowrap bg-neutral-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg transition-all pointer-events-none ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}>
        Chat with us
        <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
      </span>
      {/* Button */}
      <span
        className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-[0_6px_20px_-4px_rgba(37,211,102,0.5)] hover:shadow-[0_8px_28px_-4px_rgba(37,211,102,0.6)] hover:scale-110"
        style={{ background: "linear-gradient(135deg, #25D366 0%, #1EBE5D 100%)" }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.75-1.813A12.94 12.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3Z"
            fill="#fff"
          />
          <path
            d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51H12c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
            fill="#25D366"
          />
        </svg>
      </span>
    </a>
  );
}
