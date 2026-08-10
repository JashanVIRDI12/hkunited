import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Allow the photographic quality used by Media / VideoMedia. */
    qualities: [75, 90],
  },
};

export default nextConfig;
