module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com'],
  },
  // If you need to extend Webpack's configuration, do it here
  webpack(config, { isServer }) {
    // Add custom webpack configurations here only if necessary

    return config;
  },
};
