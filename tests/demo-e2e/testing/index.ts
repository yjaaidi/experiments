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
import type { SourceMapInput } from '@jridgewell/trace-mapping';
import { workspaceRoot } from '@nx/devkit';

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

        const converter = v8toIstanbul(
          join(workspaceRoot, VIRTUAL_ENTRYPOINT),
          0,
          {
            source: entry.source,
            sourceMap: await tryFetchSourceMap(entry.url),
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
});

const VIRTUAL_ENTRYPOINT = 'VIRTUAL_ENTRYPOINT';

async function tryFetchSourceMap(
  sourceUrl: string,
): Promise<{ sourcemap: SourceMapInput } | undefined> {
  if (!sourceUrl.endsWith('.js')) {
    return;
  }

  const response = await fetch(`${sourceUrl}.map`);

  try {
    return {
      sourcemap: await response.json(),
    };
  } catch {
    console.warn(`Failed to parse source map for: ${sourceUrl}`);
    return;
  }
}

interface CoverageReporter {
  collect(results: CoverageResults): void;
}

type CoverageResults = Awaited<ReturnType<Coverage['stopJSCoverage']>>;
