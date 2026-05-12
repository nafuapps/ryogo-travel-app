import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import withSerwistInit from "@serwist/next"

const withNextIntl = createNextIntlPlugin()

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== "production",
})

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
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/login",
        permanent: true,
      },
    ]
  },
}

export default withSerwist(withNextIntl(nextConfig))
