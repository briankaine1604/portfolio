import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    BASIC_AUTH_USER: process.env.BASIC_AUTH_USER,
    BASIC_AUTH_PASS: process.env.BASIC_AUTH_PASS,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        yjs: path.resolve(__dirname, "node_modules/yjs"),
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "test.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
