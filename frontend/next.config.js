/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // For Monaco Editor to work properly with webpack
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
};

module.exports = nextConfig;
