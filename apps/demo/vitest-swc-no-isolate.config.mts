import { mergeConfig } from 'vitest/config';
import vitestSwcConfig from './vitest-swc.config.mjs';

export default mergeConfig(vitestSwcConfig, {
  test: {
    isolate: false,
  },
});
