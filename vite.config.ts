import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [
      react(),
      // Enable bundle analyzer with ANALYZE=true environment variable
      // Usage: ANALYZE=true npm run build
      ...(process.env.ANALYZE === 'true' ? [visualizer({ open: true, gzipSize: true, brotliSize: true })] : []),
    ],
    base: '/',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code into separate chunks for better caching
            'vendor-react': ['react', 'react-dom', 'react-router'],
            'vendor-mui': ['@mui/material', '@mui/icons-material', '@mui/system'],
            'vendor-nivo': ['@nivo/pie', '@nivo/core'],
            'vendor-mapbox': ['mapbox-gl'],
            'vendor-tanstack': ['@tanstack/react-query'],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './src/test/setup.ts',
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'src/test/**',
          'src/main.tsx',
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/*.config.{js,ts}',
          '**/node_modules/**',
          '**/dist/**',
          '**/coverage/**',
        ],
      },
    },
  }
  // If not serving locally, set the base path to the project name for gh-pages deployment
  if (command !== 'serve') {
    config.base = '/school-viewer/'
  }

  return config
})
