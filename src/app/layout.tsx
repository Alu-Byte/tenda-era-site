import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/LangContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Tenda Era — Tenda & Çadra Dielli",
  description:
    "Tenda Era — prodhues i tendave dhe çadrajave premium të diellit për dyqane, bare dhe plazhe në Shqipëri që nga 1994. Sun awnings and umbrellas in Albania.",
  keywords: ["tenda", "awnings", "umbrellas", "shade", "Albania", "Tirana", "tendaera", "çadra"],
  openGraph: {
    title: "Tenda Era",
    description: "Tenda & çadra premium të diellit që nga 1994.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <LangProvider>
          {children}
          <WhatsAppButton />
        </LangProvider>
      </body>
    </html>
  );
}
