/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },
}
