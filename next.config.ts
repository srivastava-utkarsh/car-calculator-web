import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configure Turbopack (now stable in Next.js 15)
  turbopack: {
    rules: {
      // Configure file loaders for Turbopack
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Webpack configuration (only applies when not using Turbopack)
  webpack: (config, { dev, isServer, webpack }) => {
    // Only apply webpack config when not using Turbopack
    if (!dev || process.env.NEXT_RUNTIME !== 'edge') {
      if (dev && !isServer) {
        config.devtool = 'eval-source-map';
      }
    }
    return config;
  },
};

export default nextConfig;
