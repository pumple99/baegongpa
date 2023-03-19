/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `https://api.intra.42.fr/:path*`,
      },
    ];
  },
};

module.exports = nextConfig
