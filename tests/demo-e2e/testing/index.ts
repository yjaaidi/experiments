import {
  expect,
  test as base,
  type Page,
  type Coverage,
} from '@playwright/test';
import v8toIstanbul from 'v8-to-istanbul';
import istanbulLibCoverage from 'istanbul-lib-coverage';
import istanbulLibReport from 'istanbul-lib-report';
import istanbulReports from 'istanbul-reports';
import { workspaceRoot } from '@nx/devkit';
import { join } from 'node:path/posix';

export { expect };

export const test = base.extend<
  { page: Page },
  { coverageReporter: CoverageReporter }
>({
  page: async ({ coverageReporter, page }, use) => {
    await page.coverage.startJSCoverage({
      resetOnNavigation: false,
    });

    await use(page);

    const coverageResults = await page.coverage.stopJSCoverage();
    coverageReporter.collect(coverageResults);
  },
  coverageReporter: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const coverageResults: CoverageResults = [];

      await use({
        collect(results) {
          coverageResults.push(...results);
        },
      });

      const coverageMap = istanbulLibCoverage.createCoverageMap();

      for (const entry of coverageResults) {
        if (entry.source === undefined) {
          console.warn(`No source for entry: ${entry.url}`);
          continue;
        }

        if (new URL(entry.url).pathname.startsWith('/@fs/')) {
          continue;
        }

        const converter = v8toIstanbul('../../..', 0, {
          source: entry.source,
        });
        await converter.load();
        converter.applyCoverage(entry.functions);

        coverageMap.merge(converter.toIstanbul());
      }

      const context = istanbulLibReport.createContext({
        dir: join(workspaceRoot, 'coverage'),
        coverageMap,
      });
      istanbulReports.create('html').execute(context);
    },
    { scope: 'worker' },
  ],
});

interface CoverageReporter {
  collect(results: CoverageResults): void;
}

type CoverageResults = Awaited<ReturnType<Coverage['stopJSCoverage']>>;
