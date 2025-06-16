
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Re-enabled to support static export to 'out' folder
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
