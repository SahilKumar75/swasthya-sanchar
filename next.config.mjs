import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev mode for faster iteration
  runtimeCaching: [
    {
      // CRITICAL: Cache emergency pages for offline Zero-Net access
      // This catches /emergency/SS1:... URLs
      urlPattern: /\/emergency\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'emergency-pages-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      // Cache emergency API responses with network-first strategy
      urlPattern: /^\/api\/emergency\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'emergency-api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        networkTimeoutSeconds: 5, // Fallback to cache after 5s
      },
    },
    {
      // Cache Next.js static assets (JS/CSS) for offline
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'nextjs-static-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      // Cache static assets (images, fonts, etc.)
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
})(nextConfig);

