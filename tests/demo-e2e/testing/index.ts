import { test as base, expect, type Page } from '@playwright/test';
import { CoverageEntry, CoverageReporter } from './coverage-reporter';

export { expect };

export const test = base.extend<
  { page: Page },
  { collectCoverage: (entries: CoverageEntry[]) => void }
>({
  page: async ({ collectCoverage, page }, use) => {
    await page.coverage.startJSCoverage({
      resetOnNavigation: false,
    });

    await use(page);

    collectCoverage(await page.coverage.stopJSCoverage());
  },
  collectCoverage: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const coverageReporter = new CoverageReporter();

      await use((entries) => coverageReporter.collect(entries));

      await coverageReporter.writeReport();
    },
    { scope: 'worker' },
  ],
});
