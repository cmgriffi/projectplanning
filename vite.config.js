import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: command === 'serve' ? 'http://localhost:3001' : '/',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify({ error: 'Proxy error occurred' }));
            }
          });
        }
      }
    }
  }
}))
