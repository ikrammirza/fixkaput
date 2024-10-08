module.exports = {
  reactStrictMode: true,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.devServer = {
        hot: true, // Enable hot module replacement
        // Other devServer options can be configured here if needed
      };
    }

    return config;
  },
};