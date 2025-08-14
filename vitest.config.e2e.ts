// vitest.config.e2e.ts
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/infra/http/controllers/**/__e2e__/**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],

    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage/e2e', // força saída para cobertura E2E
      all: true, // mede cobertura mesmo de arquivos não importados
      include: ['src/infra/http/controllers/**/*.ts'],
      exclude: [
        '**/__e2e__/**', // ignora arquivos de teste
        '**/*.spec.ts',
        '**/*.test.ts'
      ]
    }
  },

  plugins: [
    tsConfigPaths(),
    swc.vite({ module: { type: 'es6' } })
  ]
})
