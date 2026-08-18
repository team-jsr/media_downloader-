import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['youtube-dl-exec'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/youtube-dl-exec/bin/**/*'],
  },
};

export default nextConfig;
