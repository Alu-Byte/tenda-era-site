"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastKind = "ok" | "err";
interface Toast { id: number; text: string; kind: ToastKind }

interface Ctx {
  show: (text: string, kind?: ToastKind) => void;
  ok: (text: string) => void;
  err: (text: string) => void;
}

const ToastContext = createContext<Ctx | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((text: string, kind: ToastKind = "ok") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const ok = useCallback((text: string) => show(text, "ok"), [show]);
  const err = useCallback((text: string) => show(text, "err"), [show]);

  return (
    <ToastContext.Provider value={{ show, ok, err }}>
      {children}
      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-md rounded-2xl px-4 py-3 shadow-elevated border animate-fade-up ${
              t.kind === "ok"
                ? "bg-white border-emerald-200 text-neutral-800"
                : "bg-white border-red-200 text-neutral-800"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              t.kind === "ok" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}>
              {t.kind === "ok" ? <CheckCircle size={18} /> : <XCircle size={18} />}
            </div>
            <p className="text-sm font-medium leading-snug flex-1 pt-1">{t.text}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback: log so the app doesn't crash if used outside provider
    return {
      show: (t) => console.log("[toast]", t),
      ok: (t) => console.log("[toast:ok]", t),
      err: (t) => console.error("[toast:err]", t),
    };
  }
  return ctx;
}

/** Wrap fetch — throws with a useful message on non-2xx. */
export async function apiFetch(
  url: string,
  init?: RequestInit,
): Promise<unknown> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  try { return await res.json(); } catch { return null; }
}

