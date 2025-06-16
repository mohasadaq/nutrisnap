
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enabled for static export
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
