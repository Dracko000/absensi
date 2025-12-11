import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: false, // We need to handle this properly for dynamic app
  },
  serverExternalPackages: ["xlsx"], // Updated from experimental key
  // Avoid the network interface error
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
  // Handle the HOST issue in containerized environments
  output: 'standalone',
};

export default nextConfig;