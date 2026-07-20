import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  experimental: {
    // Server Actions cap request bodies at 1MB by default, which a product photo
    // blows straight through. The admin caps uploads at 4MB (see
    // src/libs/admin/storage/constraints.ts); the headroom here covers multipart
    // overhead and the rest of the form fields riding along in the same request.
    // Note this ceiling is global to every Server Action in the app.
    serverActions: { bodySizeLimit: '8mb' }
  },
  images: {
    // Whitelisted rather than wildcarded — next/image will proxy any host listed
    // here, so keep this list to hosts we actually use.
    remotePatterns: [
      // Product photography placeholders until the client supplies real shots.
      { protocol: 'https', hostname: 'placehold.co' },

      // Decorative/atmosphere imagery.
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  redirects: async () => {
    return [
      {
        source: '/',

        // Indonesian is the default locale. Not `permanent` — if a locale
        // negotiation step is added later, a cached 308 would be painful to
        // undo in visitors' browsers.
        destination: '/id',
        permanent: false,
        locale: false
      }
    ]
  }
}

export default nextConfig
