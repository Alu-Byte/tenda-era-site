import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.120"],
  images: {
    remotePatterns: [
      // Vercel Blob — public URLs for uploaded photos.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
