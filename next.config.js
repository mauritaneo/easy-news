/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  experimental: {
    forceSwcTransforms: false,
  },
  
  webpack: (config, { isServer }) => {
    // Merge your custom webpack configuration
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  };
