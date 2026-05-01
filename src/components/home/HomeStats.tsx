"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/LangContext";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 1500 / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomeStats() {
  const { t } = useLang();

  const stats = [
    { value: 30, suffix: "+", label: t.stats.experience },
    { value: 1200, suffix: "+", label: t.stats.projects },
    { value: 4, suffix: "", label: t.stats.partners },
    { value: 100, suffix: "%", label: t.stats.satisfaction },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl lg:text-5xl font-bold text-[#c0231e] mb-2">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-[#2d2d2d]/60 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
