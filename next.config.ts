
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Removed to enable server actions
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  }
};

export default nextConfig;
