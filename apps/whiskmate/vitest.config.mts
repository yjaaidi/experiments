import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';
import { join } from 'node:path/posix';

const __dirname = new URL('.', import.meta.url).pathname;

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@jscutlery/playwright-ct-angular': join(
          __dirname,
          './vitest-bridge.ts',
        ),
      },
    },
    test: {
      pool: 'threads',
      css: true,
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      setupFiles: ['src/test-setup.ts'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/whiskmate',
        provider: 'v8',
      },
    },
  }),
);
