/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://chatledger-api.onrender.com/api/v1',
  },
  webpack: (config) => {
    config.resolve.alias['@nexaflow/shared-types'] = path.resolve(__dirname, 'src/types/shared-types');
    return config;
  },
};

module.exports = nextConfig;
