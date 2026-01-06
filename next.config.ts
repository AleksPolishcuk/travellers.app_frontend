import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
        pathname: '/img/harmoniq/users/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },

      {
        protocol: 'https',
        hostname: 'travellers-app-backend.onrender.com',
        pathname: '/uploads/:path(*\.(jpg|jpeg|png|webp|gif))',
      },
    ],

    contentDispositionType: 'attachment',
    contentSecurityPolicy:
      "default-src 'self'; img-src 'self' https://ftp.goit.study https://res.cloudinary.com https://travellers-app-backend.onrender.com;",
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
