"use client";

import { useLang } from "@/lib/LangContext";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { useSiteInfo } from "@/lib/useSiteInfo";

export default function ContactContent() {
  const { lang, t } = useLang();
  const c = t.contact_page;
  const { openingHours } = useSiteInfo();

  return (
    <>
      <section className="relative pt-36 pb-24 px-6 overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#a03e14]/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#dc7a5f]/10 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="inline-flex items-center gap-2 text-[#dc7a5f] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <span className="w-6 h-px bg-[#dc7a5f]" />
            {c.label}
            <span className="w-6 h-px bg-[#dc7a5f]" />
          </p>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">{c.title}</h1>
          <p className="text-white/65 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">{c.desc}</p>
        </div>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 right-0 w-full h-16 block">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1350,50 1440,30 L1440,80 L0,80 Z" fill="#faf7f2" />
        </svg>
      </section>

      <section className="bg-[#faf7f2] py-20 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mb-8 tracking-tight">{c.story_title}</h2>
            <div className="space-y-5 mb-10">
              {[
                { icon: MapPin, label: c.address, value: 'Era shpk Prush Vaqarr Rruga Green Line km 1, Tiranë\nRr. "Muhedin Llagani", Tiranë', href: null },
                { icon: Phone, label: c.phone, value: "+355 69 207 5317 / 5318 / 5319", href: "tel:+355692075317" },
                { icon: Mail, label: c.email, value: "info@tendaera.com", href: "mailto:info@tendaera.com" },
                { icon: Clock, label: c.hours, value: `${lang === "sq" ? openingHours.weekdays_sq : openingHours.weekdays_en}\n${lang === "sq" ? openingHours.saturday_sq : openingHours.saturday_en}`, href: null },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 p-4 -mx-4 rounded-2xl hover:bg-white transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fbeae2] to-[#f5d5c1] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon size={20} className="text-[#a03e14]" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[11px] text-neutral-400 uppercase tracking-[0.15em] font-bold mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-neutral-900 font-medium hover:text-[#a03e14] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-neutral-900 font-medium whitespace-pre-line leading-relaxed">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-[0.15em] font-bold mb-4">{c.follow}</p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/profile.php?id=61585040403719" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-800 hover:border-[#a03e14] hover:text-[#a03e14] hover:shadow-soft transition-all touch-manipulation no-underline">
                  <FacebookIcon size={16} /> Facebook
                </a>
                <a href="https://www.instagram.com/cadra.tenda.erashpk/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-800 hover:border-[#a03e14] hover:text-[#a03e14] hover:shadow-soft transition-all touch-manipulation no-underline">
                  <InstagramIcon size={16} /> Instagram
                </a>
              </div>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden h-56 border border-neutral-200 shadow-soft">
              <iframe
                src="https://maps.google.com/maps?q=Era+shpk+Prush+Vaqarr+Rruga+Green+Line+km+1,+Tirana,+Albania&output=embed"
                width="100%"
                height="224"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Era shpk location"
              />
            </div>
          </div>

          <div><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
