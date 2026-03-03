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

};

module.exports = nextConfig;
