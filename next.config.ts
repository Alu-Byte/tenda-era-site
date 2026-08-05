import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.120"],
  images: {
    remotePatterns: [
      // Cloudinary — public URLs for uploaded photos.
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 100],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
