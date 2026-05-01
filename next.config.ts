import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow serving images from the local /public/uploads directory
    // and any future external domains
    remotePatterns: [],
    // unoptimized for local file uploads (no need for a separate image CDN)
    unoptimized: true,
  },
};

export default nextConfig;
