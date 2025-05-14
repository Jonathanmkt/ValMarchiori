/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}'
    }
  }
};

module.exports = nextConfig;
