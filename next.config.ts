import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'vtn-v2.s3.sa-east-1.amazonaws.com',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'finassist-storage.s3.us-east-1.amazonaws.com',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
