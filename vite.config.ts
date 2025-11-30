import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sereno APP Test',
        short_name: 'Sereno APP',
        description: 'A PWA test for Sereno APP',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          charts: ['recharts'],
          cmdk: ['cmdk'],
          carousel: ['embla-carousel-react'],
          datefns: ['date-fns'],
        },
      },
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: path.resolve(__dirname, './src/test/setup.tsx'),
    css: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 1,
        minThreads: 1,
      },
    },
    testTimeout: 5000,
    fileParallelism: false,
    deps: {
      inline: ['react', 'react-dom'],
    },
  },
}));
