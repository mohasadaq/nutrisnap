
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Removed to support Server Actions
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
