/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
