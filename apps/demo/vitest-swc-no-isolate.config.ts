import { mergeConfig } from 'vitest/config';
import vitestSwcConfig from './vitest-swc.config';

export default mergeConfig(vitestSwcConfig, {
  test: {
    isolate: false,
  },
});
