import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://caravana-api-dev.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
