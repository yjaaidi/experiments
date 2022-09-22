import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
  },
};
export default config;
