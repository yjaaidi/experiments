import { swcAngularVitePreset } from '@jscutlery/swc-angular-preset';
import swc from 'unplugin-swc';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  {
    ...viteConfig,
    plugins: [swc.vite(swcAngularVitePreset())],
  },
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
