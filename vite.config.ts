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
    // Optimize CSS extraction to prevent render blocking
    cssCodeSplit: false, // Bundle CSS into single file for better defer loading
    rollupOptions: {
      output: {
        // Strategic code splitting using function-based approach for proper path handling
        manualChunks: (id) => {
          // Core React libraries - needed immediately
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-core';
          }
          
          // UI components and utilities - needed for basic functionality  
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-core';
          }
          
          // Data management - used across multiple pages
          if (id.includes('@tanstack/react-query') || id.includes('@supabase/supabase-js')) {
            return 'data-management';
          }
          
          // Heavy animation components - defer loading
          if (id.includes('/SplashCursor.') || id.includes('/NetworkAnimation.')) {
            return 'animations';
          }
          
          // Admin and dashboard features - only for authenticated users
          if (id.includes('/components/admin/') || id.includes('/Admin.') || id.includes('/Dashboard.') || 
              id.includes('/components/employer/') || id.includes('/components/instructor/')) {
            return 'admin';
          }
          
          // Course and learning content - secondary pages
          if (id.includes('/Courses.') || id.includes('/ModuleDetail.') || id.includes('/TopicDetail.') || 
              id.includes('/Specialties.') || id.includes('/MyCourses.')) {
            return 'learning';
          }
          
          // Authentication and user management
          if (id.includes('/Auth.') || id.includes('/ResetPassword.') || id.includes('/components/auth/')) {
            return 'auth';
          }
          
          // Projects and jobs - feature-specific
          if (id.includes('/Projects.') || id.includes('/ProjectDetail.') || 
              id.includes('/Jobs.') || id.includes('/JobDetail.')) {
            return 'projects-jobs';
          }
          
          // Partner functionality - specialized features
          if (id.includes('/Partner.') || id.includes('/PartnerCourseDetail.') || 
              id.includes('/PrivateCourses.') || id.includes('/components/partner/')) {
            return 'partner';
          }
          
          // Keep vendor dependencies separate
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // Default chunk for remaining code
          return 'main';
        },
        
        // Optimize chunk file names for better caching with longer hash
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '') || 'chunk'
            : 'chunk';
          return `js/${facadeModuleId}-[hash:12].js`;
        },
        
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash:12][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash:12][extname]`;
          }
          return `assets/[name]-[hash:12][extname]`;
        }
      }
    },
    
    // Additional optimizations - use default esbuild minification (faster than terser)
    minify: true, // Use default esbuild minifier
    
    // Target modern browsers for smaller bundles
    target: 'es2020'
  }
}));
