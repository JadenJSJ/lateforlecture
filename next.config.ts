import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/lateforlecture',
  assetPrefix: '/lateforlecture/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
