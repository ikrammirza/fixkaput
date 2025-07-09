const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ Needed for Docker deployment
  images: {
    domains: ['images.pexels.com'], // ✅ For external image loading
  },
  webpack(config, { isServer }) {
    // Customize webpack config only if needed
    return config;
  },
};

module.exports = nextConfig;

