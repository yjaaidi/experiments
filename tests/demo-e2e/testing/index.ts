import { test as base, expect, type Page } from '@playwright/test';
import { CoverageCollector } from './coverage-collector';
import { CoverageWriterImpl } from './coverage-writer-impl';
import { CoverageWriterC8 } from './coverage-writer-c8';

export { expect };

export const test = base.extend<
  { page: Page },
  {
    _coverageCollector: CoverageCollector;
  }
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
    async ({}, use, { parallelIndex }) => {
      const collector = new CoverageCollector();
      await use(collector);

      for (const writer of [
        new CoverageWriterC8(parallelIndex),
        new CoverageWriterImpl(parallelIndex),
      ]) {
        await writer.write(collector.getCoverageEntries());
      }
    },
    { scope: 'worker' },
  ],
});
