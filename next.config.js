/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external images if needed
  images: {
    domains: [],
  },
  // Increase serverless function timeout for AI report generation
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  // Force webpack rebuild by modifying config - v2
  webpack: (config, { isServer }) => {
    // Disable persistent caching to force rebuild
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
