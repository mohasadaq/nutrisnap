
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enable static export for 'out' folder generation
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
