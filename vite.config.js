import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      // Add global polyfills
      define: {
        global: 'globalThis',
        'process.env': '{}'
      }
    },
    include: [
      '@solana/web3.js',
      '@solana/spl-token',
      'buffer'
    ]
  },
  resolve: {
    alias: {
      // Provide polyfills for Node.js core modules
      buffer: 'buffer/',
      stream: 'stream-browserify',
      events: 'events/'
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large dependencies into separate chunks
          'solana-deps': ['@solana/web3.js', '@solana/spl-token']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://metarama-webhook-g603.onrender.com',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
});