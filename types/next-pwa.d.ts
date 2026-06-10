declare module "next-pwa" {
  import type { NextConfig } from "next";

  type WithPWA = (config: NextConfig) => NextConfig;

  const withPWA: (options?: Record<string, unknown>) => WithPWA;

  export default withPWA;
}
