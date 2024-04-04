/// <reference types='vitest' />
import { defineConfig } from 'vite';

import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/demo',

  plugins: [
    angular({
      tsconfig: 'apps/demo/tsconfig.vitest.json',
    }),
  ],
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup-vitest.ts'],
    reporters: ['default'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    isolate: false,
    watch: false,
    coverage: {
      reportsDirectory: '../../coverage/apps/demo',
      provider: 'v8',
    },
  },
});
