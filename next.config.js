/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.209.8.223:8080/:path*',
      },
      {
        source: '/auth/:path*',
        destination: `https://api.intra.42.fr/:path*`,
      }
    ];
  },
};

module.exports = nextConfig
