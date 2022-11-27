/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'experimental-edge', // 'node.js' (default) | 'experimental-edge'
    appDir: true,
  },
}

module.exports = nextConfig
