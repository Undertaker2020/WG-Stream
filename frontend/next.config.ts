import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['wg-stream.s3-website.eu-north-1.amazonaws.com'],
  },
};

export default withNextIntl(nextConfig);
