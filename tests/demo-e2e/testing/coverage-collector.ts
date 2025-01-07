import { workspaceRoot } from '@nx/devkit';
import { Coverage } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path/posix';

export class CoverageCollector {
  private _coverageEntries: CoverageEntry[] = [];

  constructor(private _parallelIndex: number) {}

  collect(coverageEntries: CoverageEntry[]) {
    this._coverageEntries = [...this._coverageEntries, ...coverageEntries];
  }

  async write() {
    /* Sourcemap inlining and path reworking is required by
     * C8 and v8-to-istanbul but not necessary for MCR. */
    const entries = await Promise.all(
      this._coverageEntries.map(async (entry) => {
        if (entry.url.endsWith('.js') && entry.source) {
          const url = new URL(entry.url);
          url.port = '';
          url.protocol = 'file';
          url.host = '';
          url.pathname = join(workspaceRoot, url.pathname);

          return {
            ...entry,
            url: url.toString(),
            source: await inlineSourceMap({
              url: entry.url,
              source: entry.source,
            }),
          };
        }
        return entry;
      }),
    );

    await mkdir(COVERAGE_TMP_DIR, { recursive: true });
    const filePath = join(
      COVERAGE_TMP_DIR,
      `coverage-${this._parallelIndex}.json`,
    );
    await writeFile(
      filePath,
      JSON.stringify({
        result: entries,
        timestamp: Date.now() / 10_000_000,
      }),
    );
  }
}

export type CoverageEntry = Awaited<ReturnType<Coverage['stopJSCoverage']>>[0];

const COVERAGE_TMP_DIR = join(workspaceRoot, 'dist', 'coverage-tmp');

async function inlineSourceMap({
  source,
  url,
}: {
  source: string;
  url: string;
}) {
  const sourceMapContent = await tryFetchSourceMap(url);
  if (!sourceMapContent) {
    return source;
  }

  const base64SourceMap = Buffer.from(sourceMapContent).toString('base64');

  return source.replace(
    /\/\/# sourceMappingURL=.+\.map/,
    `//# sourceMappingURL=data:application/json;base64,${base64SourceMap}`,
  );
}

async function tryFetchSourceMap(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${url}.map`);
    return await response.text();
  } catch {
    console.warn(`No source map found for: ${url}`);
    return;
  }
}
