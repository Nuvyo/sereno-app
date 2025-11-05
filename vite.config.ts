import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

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
  plugins: [react()],
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
    // Use thread-based pool to avoid occasional fork startup timeouts on Windows paths with non-ASCII chars
    pool: 'threads',
    poolOptions: {
      threads: {
        // Force single worker to avoid thread runner startup issues in some Windows environments
        maxThreads: 1,
        minThreads: 1,
      },
    },
    // Slightly higher timeout to reduce flakiness on slower CI
    testTimeout: 5000,
    // Force sequential test execution
    fileParallelism: false,
    deps: {
      inline: ['react', 'react-dom'],
    },
  },
}));
