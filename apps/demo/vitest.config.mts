import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';
import angular from '@analogjs/vite-plugin-angular';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      setupFiles: ['src/test-setup-vitest.ts'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/demo',
        provider: 'v8',
      },
    },
  }),
);
