/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure CSS modules work properly with PostCSS and Tailwind
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;