import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  cacheComponents: false,
  typedRoutes: true,
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [new URL("https://uxlvdjfgmmorufabopzd.supabase.co/**")],
  },
}

export default withNextIntl(nextConfig)
