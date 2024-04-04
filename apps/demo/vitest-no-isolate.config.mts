import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config.mjs';

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      isolate: false,
    },
  }),
);
