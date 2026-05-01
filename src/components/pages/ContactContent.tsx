"use client";

import { useLang } from "@/lib/LangContext";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";

export default function ContactContent() {
  const { lang, t } = useLang();
  const c = t.contact_page;

  return (
    <>
      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c0231e] text-sm font-semibold uppercase tracking-widest mb-3">{c.label}</p>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">{c.title}</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{c.desc}</p>
        </div>
      </section>

      <div className="bg-[#1a1a1a] h-12 relative">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#faf8f4]" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </div>

      <section className="bg-[#faf8f4] py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#1a1a1a] mb-8">{c.story_title}</h2>
            <div className="space-y-6 mb-10">
              {[
                { icon: MapPin, label: c.address, value: 'Rr. "Muhedin Llagani", Tiranë, Shqipëri', href: null },
                { icon: Phone, label: c.phone, value: "+355 692 075 317 / 318 / 319", href: "tel:+355692075317" },
                { icon: Mail, label: c.email, value: "info@tendaera.com", href: "mailto:info@tendaera.com" },
                { icon: Clock, label: c.hours, value: c.hours_val, href: null },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c0231e]/10 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-[#c0231e]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#2d2d2d]/50 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-[#1a1a1a] font-medium hover:text-[#c0231e] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-[#1a1a1a] font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-[#2d2d2d]/50 uppercase tracking-wider font-semibold mb-4">{c.follow}</p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 border border-[#e5e5e5] rounded-full text-sm font-medium text-[#1a1a1a] hover:border-[#c0231e] hover:text-[#c0231e] transition-colors touch-manipulation">
                  <FacebookIcon size={16} /> Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 border border-[#e5e5e5] rounded-full text-sm font-medium text-[#1a1a1a] hover:border-[#c0231e] hover:text-[#c0231e] transition-colors touch-manipulation">
                  <InstagramIcon size={16} /> Instagram
                </a>
              </div>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] h-56 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(192,35,30,0.4) 30px, rgba(192,35,30,0.4) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(192,35,30,0.4) 30px, rgba(192,35,30,0.4) 31px)` }} />
              <div className="relative z-10 text-center">
                <MapPin size={40} className="text-[#c0231e] mx-auto mb-2" />
                <p className="text-white font-semibold">Tiranë, Shqipëri</p>
                <a href="https://maps.google.com/?q=Tirana,Albania" target="_blank" rel="noopener noreferrer" className="text-[#c0231e] text-sm hover:underline">
                  {lang === "sq" ? "Hap në Google Maps →" : "Open in Google Maps →"}
                </a>
              </div>
            </div>
          </div>

          <div><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
