import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['unsworn-stock-naturist.ngrok-free.dev'],
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "utfs.io",
    },
    {
      protocol: "https",
      hostname: "*.ufs.sh",
    },
    {
      protocol: "https",
      hostname: "unsworn-stock-naturist.ngrok-free.dev",
    },
  ],
},
};

export default nextConfig;
