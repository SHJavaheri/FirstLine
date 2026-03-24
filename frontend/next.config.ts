import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false, // Disable for Cloudflare Workers compatibility
};

export default nextConfig;
