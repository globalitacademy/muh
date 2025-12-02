import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['education-favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Limitless Learning Hub',
        short_name: 'Learning Hub',
        description: 'Ժամանակակից կրթական հարթակ բարձրորակ դասընթացներով',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // CSS optimization to reduce unused CSS
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split CSS by entry points to enable better loading
        manualChunks: {
          // Critical components that need immediate CSS
          'critical': [
            './src/components/Hero.tsx',
            './src/components/Header.tsx'
          ],
          // Non-critical components that can load later
          'features': [
            './src/components/EnhancedFeatures.tsx',
            './src/components/Courses.tsx'
          ],
          // Heavy animation components
          'animations': [
            './src/components/SplashCursor.tsx',
            './src/components/NetworkAnimation.tsx'
          ]
        }
      }
    }
  }
}));
