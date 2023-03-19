/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://13.209.8.223:8080/',
      },
      {
        source: '/api/:path*',
        destination: `https://api.intra.42.fr/:path*`,
      },
    ];
  },
};

module.exports = nextConfig
