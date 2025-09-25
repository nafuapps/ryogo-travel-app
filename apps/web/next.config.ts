import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  typedRoutes: true,
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, "../../node_modules/react"),
      "react-dom": path.resolve(__dirname, "../../node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(
        __dirname,
        "../../node_modules/react/jsx-runtime.js"
      ),
    };
    //Support importing from the packages directory
    // config.resolve.modules = [...config.resolve.modules, "../../packages"];
    return config;
  },
};

export default withNextIntl(nextConfig);
