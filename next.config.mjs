/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable PWA features in the v0 preview environment
  pwa: {
    disable: true,
    dest: 'public'
  },
  // Ensure no service worker is registered
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: 'false',
          },
        ],
      },
    ]
  },
}

export default nextConfig
