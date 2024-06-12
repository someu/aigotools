const createNextIntlPlugin = require("next-intl/plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  },
  sassOptions: {
    // includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [],
  },
};

const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl(nextConfig);
