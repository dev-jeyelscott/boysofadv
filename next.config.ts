import type { NextConfig } from "next";
import withPWAInit from "next-pwa";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  importScripts: ["/push-worker.js"],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  allowedDevOrigins: ["unsworn-stock-naturist.ngrok-free.dev"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "unsworn-stock-naturist.ngrok-free.dev",
      },
      {
        protocol: "https",
        hostname: "boysofadv.vercel.app",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
