import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: './src',

  test: {
    globals: true,
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '../data/**',
      '**/data/**',
    ],
    watchExclude: ['**/data/**', '../data/**'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'core/either/**',
        'infra/database/**'
      ]
    }
  },

  server: {
    watch: {
      ignored: ['**/data/**', '../data/**'],
    },
  },

  plugins: [
    tsConfigPaths(),
    swc.vite({ module: { type: 'es6' } }),
  ],
})
