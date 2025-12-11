import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Optional: adds trailing slashes to URLs
  experimental: {
    serverComponentsExternalPackages: ["xlsx"],
  },
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
};

export default nextConfig;