/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: 'https://baegongpa.vercel.app/:path*',
        destination: `https://api.intra.42.fr/:path*`,
      },
    ];
  },
};

module.exports = nextConfig
