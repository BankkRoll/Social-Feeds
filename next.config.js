/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react-tweet"],
  images: {
    domains: ["i.ibb.co", "www.bankkroll.xyz"],
  },
};

module.exports = nextConfig;
