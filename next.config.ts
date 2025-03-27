import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true, // Only use this if you're confident about your types
  },
  webpack: (config, { isServer }) => {
    // Add any webpack configurations if needed
    return config;
  },
};

export default nextConfig;

