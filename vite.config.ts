import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
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
