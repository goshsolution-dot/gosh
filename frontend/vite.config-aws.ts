import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration for S3 deployment
  build: {
    // Output directory for S3 upload
    outDir: 'dist',
    
    // Ensure proper source maps for debugging
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
      },
    },
    
    // Asset inlining thresholds
    assetsInlineLimit: 4096,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Generate consistent file names for better caching
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'images/[name].[hash][extname]'
          } else if (/\.css$/.test(name ?? '')) {
            return 'css/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        },
      },
    },
  },
  
  // Server configuration for local development
  server: {
    port: 5173,
    
    // Proxy API requests to backend
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __API_ENDPOINT__: JSON.stringify(
      process.env.REACT_APP_API_ENDPOINT || 'http://localhost:5001/api'
    ),
  },
})
