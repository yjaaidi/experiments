import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      isolate: false,
      pool: 'threads',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,mts}'],
      setupFiles: ['src/test-setup.ts'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/whiskmate',
        provider: 'istanbul',
      },
      typecheck: {
        tsconfig: 'tsconfig.spec.json',
      },
    },
  }),
);
