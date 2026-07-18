import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/work', destination: '/', permanent: true },
      { source: '/work/:slug*', destination: '/', permanent: true },
      { source: '/contact', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
