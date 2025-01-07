import { test as base, expect, type Page } from '@playwright/test';
import { CoverageReporterV8ToInstanbul } from './coverage-reporter-v8-to-instanbul';
import { CoverageCollector, CoverageReporter } from './core';

export { expect };

export const test = base.extend<
  { page: Page },
  { _coverageCollector: CoverageCollector; _coverageReporter: CoverageReporter }
>({
  page: async ({ _coverageCollector, page }, use) => {
    await page.coverage.startJSCoverage({
      resetOnNavigation: false,
    });

    await use(page);

    _coverageCollector.collect(await page.coverage.stopJSCoverage());
  },
  _coverageCollector: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await use(new CoverageCollector());
    },
    { scope: 'worker' },
  ],
  _coverageReporter: [
    async ({ _coverageCollector }, use) => {
      const coverageReporter = new CoverageReporterV8ToInstanbul();

      await use(coverageReporter);

      await coverageReporter.writeReport(
        _coverageCollector.getCoverageEntries(),
      );
    },
    { scope: 'worker', auto: true },
  ],
});
