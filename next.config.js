module.exports = {
  reactStrictMode: true,

  // Set the output to 'export' for static export
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

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