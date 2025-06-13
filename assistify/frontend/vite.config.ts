import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*'],
        maximumFileSizeToCacheInBytes: 2621440,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.href.includes('pythonanywhere'),
            handler: 'CacheFirst' as const,
            options: {
              cacheName: 'cache-backend',
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
      includeAssets: ['/logo_192.svg', '/logo_512.png', '/logo_180.png', '/Logo.svg'],
      manifest: {
        name: 'Assistify',
        short_name: 'Assistify',
        description: 'Assistify app',
        icons: [
          {
            src: '/logo_192.svg',
            sizes: '192x192',
            type: 'image/svg',
            purpose: 'favicon',
          },
          {
            src: '/logo_512.png',
            sizes: '512x512',
            type: 'image/svg',
            purpose: 'favicon',
          },
          {
            src: '/logo_180.png',
            sizes: '180x180',
            type: 'image/svg',
            purpose: 'apple touch icon',
          },
          {
            src: '/Logo.svg',
            sizes: '512x512',
            type: 'image/svg',
            purpose: 'any maskable',
          },
        ],
        theme_color: '#3D8CEC',
        background_color: '#3DB66B',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
      },
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
