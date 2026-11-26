import type { NextConfig } from "next";
import { getLocalDevOrigins } from "./config/dev-network";

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalDevOrigins(),
};

export default nextConfig;
