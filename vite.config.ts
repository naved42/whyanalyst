import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';

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
        allow: [".", "src"]
      }
    },
    // ============================================================
    // ESBUILD: Aggressive tree-shaking & minification
    // ============================================================
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
      // Tree-shake aggressively in production
      pure: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      minifyIdentifiers: isProd,
      minifySyntax: isProd,
      minifyWhitespace: isProd,
    },

    // ============================================================
    // BUILD: Advanced code splitting & chunking strategy
    // ============================================================
    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 2, // Multiple passes for better compression
          hoist_funs: true,
          reduce_vars: true,
        },
        mangle: {
          properties: false,
        },
        format: {
          comments: false,
          beautify: false,
        },
      },

      rollupOptions: {
        output: {
          // ========================================================
          // MANUAL CHUNKS: Split by feature & library size
          // ========================================================
          manualChunks(id) {
            // ✅ Heavy charting library
            if (id.includes('plotly.js') || id.includes('react-plotly')) {
              return 'plotly-chart';
            }

            // ✅ Data parsing libraries
            if (id.includes('xlsx')) {
              return 'file-parser-xlsx';
            }
            if (id.includes('papaparse')) {
              return 'file-parser-csv';
            }

            // ✅ Firebase
            if (id.includes('firebase')) {
              return 'firebase-auth';
            }

            // ✅ Animation library
            if (id.includes('motion/react') || id.includes('@motionone')) {
              return 'motion-lib';
            }

            // ✅ Scroll library
            if (id.includes('lenis')) {
              return 'scroll-lib';
            }

            // ✅ Google Generative AI
            if (id.includes('@google/genai')) {
              return 'genai-lib';
            }

            // ✅ Base UI components
            if (id.includes('@base-ui/react')) {
              return 'base-ui';
            }

            // ✅ React core
            if (id.includes('react') && !id.includes('react-')) {
              return 'react-core';
            }
            if (id.includes('react-dom') || id.includes('react-markdown')) {
              return 'react-ecosystem';
            }

            // ✅ UI icons
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }

            // ✅ Core vendor chunk for remaining dependencies
            if (id.includes('node_modules')) {
              return 'vendor-other';
            }
          },

          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
        onwarn(warning, warn) {
          // Ignore intentional large chunks from code splitting
          if (warning.code === 'BUNDLE_SIZE') {
            return;
          }
          // Use default for everything else
          warn(warning);
        },
      },

      // Increase warning threshold since we're doing intentional chunking
      chunkSizeWarningLimit: 1500,
      sourcemap: false,
      cssCodeSplit: true,
      reportCompressedSize: false,
    },

    // ============================================================
    // OPTIMIZE DEPS: Pre-bundle critical dependencies
    // ============================================================
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        // Motion used in many components - worth pre-bundling
        'motion/react',
        '@motionone/dom',
        // Icons used widely
        'lucide-react',
      ],
      // Exclude heavy libs from pre-bundling (let them load as needed)
      exclude: [
        'plotly.js',
        'xlsx',
        'papaparse',
        'firebase',
        'lenis',
        '@google/genai',
      ],
    },
  };
});
