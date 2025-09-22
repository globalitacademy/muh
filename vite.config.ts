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
    // Optimize JavaScript code splitting to reduce unused code
    rollupOptions: {
      output: {
        // Strategic code splitting for maximum bundle optimization
        manualChunks: {
          // Core React and routing - needed immediately
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          
          // UI components and utilities - needed for basic functionality
          'ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            'lucide-react'
          ],
          
          // Data management - used across multiple pages
          'data-management': [
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          
          // Heavy animation components - defer loading
          'animations': [
            './src/components/SplashCursor.tsx',
            './src/components/NetworkAnimation.tsx'
          ],
          
          // Admin and dashboard features - only for authenticated users
          'admin': [
            './src/pages/Admin.tsx',
            './src/pages/Dashboard.tsx',
            './src/components/admin/',
            './src/components/employer/',
            './src/components/instructor/'
          ],
          
          // Course and learning content - secondary pages
          'learning': [
            './src/pages/Courses.tsx',
            './src/pages/ModuleDetail.tsx',
            './src/pages/TopicDetail.tsx',
            './src/pages/Specialties.tsx',
            './src/pages/MyCourses.tsx'
          ],
          
          // Authentication and user management
          'auth': [
            './src/pages/Auth.tsx',
            './src/pages/ResetPassword.tsx',
            './src/components/auth/'
          ],
          
          // Projects and jobs - feature-specific
          'projects-jobs': [
            './src/pages/Projects.tsx',
            './src/pages/ProjectDetail.tsx',
            './src/pages/Jobs.tsx',
            './src/pages/JobDetail.tsx'
          ],
          
          // Partner functionality - specialized features
          'partner': [
            './src/pages/Partner.tsx',
            './src/pages/PartnerCourseDetail.tsx',
            './src/pages/PrivateCourses.tsx',
            './src/components/partner/'
          ]
        },
        
        // Optimize chunk file names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '') || 'chunk'
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        }
      }
    },
    
    // Additional optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      }
    },
    
    // Target modern browsers for smaller bundles
    target: 'es2020'
  }
}));
