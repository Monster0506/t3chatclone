import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // disable eslint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // disable typescript
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
