"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  /** 1–5 → stagger via CSS delay classes */
  delay?: 1 | 2 | 3 | 4 | 5;
  /** Extra className merged onto the wrapper */
  className?: string;
  /** Wrapper element — defaults to div */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps children in a scroll-triggered fade-up.
 * Uses IntersectionObserver so the animation only fires once, when the
 * element first enters the viewport.
 */
export default function Reveal({ children, delay, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If user has reduced-motion on, just show immediately (matches CSS override)
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as keyof React.JSX.IntrinsicElements;
  const classes = [
    "reveal",
    delay ? `delay-${delay}` : "",
    visible ? "is-visible" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    // @ts-expect-error — dynamic tag typing
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
