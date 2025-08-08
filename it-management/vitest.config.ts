import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // <<< raiz do Vite/Vitest passa a ser ./src
  root: './src',

  test: {
    globals: true,
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // se por algum motivo for referenciado a partir de src:
      '../data/**',      // data na raiz do projeto
      '**/data/**',
    ],
    // evita watcher tocar na pasta proibida
    watchExclude: ['**/data/**', '../data/**'],
    // opcional:
    // teardownTimeout: 20000,
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
