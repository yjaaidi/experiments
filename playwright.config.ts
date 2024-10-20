import { defineConfig, devices } from '@playwright/test';
import { dirname } from 'node:path/posix';

export default {
  ...defineConfig({
    testDir: './src',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
      /* Base URL to use in actions like `await page.goto('/')`. */
      baseURL: 'http://localhost:4200',

      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: 'on-first-retry',
    },
    /* Configure projects for major browsers */
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    timeout: 3_000,
  }),
  '@playwright/test': {
    babelPlugins: [
      [
        urlToPath(
          import.meta.resolve('./dist/transform-run-in-browser/transform.js'),
        ),
        { projectRoot: dirname(urlToPath(import.meta.url)) },
      ],
    ],
  },
};

function urlToPath(url: string) {
  return new URL(url).pathname;
}
