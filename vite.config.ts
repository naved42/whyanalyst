import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    server: {
      middlewareMode: true,
      fs: {
        allow: [
          ".",
          "src"
        ]
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'motion': ['motion/react'],
            'ui-components': ['lucide-react', 'sonner'],
            'lenis': ['lenis/react'],
          }
        }
      },
      minify: 'esbuild',
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'motion/react', 'lenis/react'],
    },
  };
});
