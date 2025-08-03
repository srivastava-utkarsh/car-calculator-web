import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Completely disable all development indicators and overlays
  devIndicators: {
    buildActivity: false,
  },
  // Disable error overlay in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
