/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  // For Github pages
  images: {
    loader: 'akamai',
    path: '',
  },
}

module.exports = nextConfig
