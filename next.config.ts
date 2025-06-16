
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Removed to support Server Actions and live loading in mobile app
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
