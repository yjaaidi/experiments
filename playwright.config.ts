import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'yarn start',
        url: 'http://127.0.0.1:3000/recipes',
        timeout: 20 * 1000,
        reuseExistingServer: !process.env.CI,
      },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
  },
};
export default config;
