import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['tegaki'],
  webpack(config) {
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[hash][ext]',
      },
    })
    return config
  },
}

export default nextConfig
