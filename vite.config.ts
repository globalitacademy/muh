import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
