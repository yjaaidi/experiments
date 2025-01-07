import { join, relative } from 'node:path/posix';
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

export { expect };

export const test = base.extend<
  { page: Page },
  { coverageReporter: CoverageReporter } & Options
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
    async ({ sourceMapFolder }, use) => {
      if (!sourceMapFolder) {
        throw new Error(
          'Please provide `sourceMapFolder` to specify the path to the source maps.',
        );
      }

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

        /* Fix sourcemap path. */
        entry.source = entry.source.replace(
          'sourceMappingURL=',
          `sourceMappingURL=${join(workspaceRoot, sourceMapFolder)}/`,
        );

        const converter = v8toIstanbul(
          join(workspaceRoot, VIRTUAL_ENTRYPOINT),
          0,
          {
            source: entry.source,
          },
        );
        await converter.load();
        converter.applyCoverage(entry.functions);
        coverageMap.merge(converter.toIstanbul());
        converter.destroy();
      }

      coverageMap.filter((file) => {
        const relativePath = relative(workspaceRoot, file);

        if (relativePath === VIRTUAL_ENTRYPOINT) {
          return false;
        }

        if (relativePath.startsWith('node_modules')) {
          return false;
        }

        return true;
      });

      const context = istanbulLibReport.createContext({
        dir: join(workspaceRoot, 'coverage'),
        defaultSummarizer: 'nested',
        coverageMap,
      });
      istanbulReports.create('html').execute(context);
    },
    { scope: 'worker' },
  ],
  sourceMapFolder: [undefined, { scope: 'worker', option: true }],
});

const VIRTUAL_ENTRYPOINT = 'VIRTUAL_ENTRYPOINT';

interface CoverageReporter {
  collect(results: CoverageResults): void;
}

type CoverageResults = Awaited<ReturnType<Coverage['stopJSCoverage']>>;

export interface Options {
  sourceMapFolder?: string;
}
