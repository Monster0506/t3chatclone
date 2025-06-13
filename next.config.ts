import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // disable eslint
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* config options here */
};

export default nextConfig;
