import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/utils/setup.ts'],
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'clover', 'html'],
      exclude: ['node_modules', 'src/config', 'src/app.ts', 'tests'],
    },
    resolve: {
      alias: {
        '@haber/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      },
    },
  },
});
