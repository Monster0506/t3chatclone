import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // disable eslint
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
        new URL("https://upload.wikimedia.org/**")
    ],
  },

};

export default nextConfig;
