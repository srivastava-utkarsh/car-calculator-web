import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
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
  
  // Security headers (not supported in static export)
  // Will be handled by Cloudflare Pages
  
  // Webpack configuration (production optimizations)
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    
    // Development source maps
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    
    return config;
  },
};

export default nextConfig;
