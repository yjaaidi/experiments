import { workspaceRoot } from '@nx/devkit';
import { dirname, join, relative } from 'node:path/posix';
import { CoverageEntry } from './core';
import { CoverageWriter } from './coverage-writer';
import { forceWriteFile, forceWriteJsonFile, tryFetchSourceMap } from './infra';

/**
 * @deprecated Use `CoverageWriterImpl` instead.
 *
 * This class is just meant to highlight the limitations
 * presented https://github.com/bcoe/c8/issues/339.
 */
export class CoverageWriterC8 implements CoverageWriter {
  constructor(private _parallelIndex: number) {}

  async write(coverageEntries: CoverageEntry[]): Promise<void> {
    /* Sourcemap inlining and path reworking is required by C8.
     * Cf. https://github.com/bcoe/c8/issues/339 */
    const entries = await Promise.all(
      coverageEntries.map(async (entry) => {
        if (!entry.source) {
          return entry;
        }

        const url = new URL(entry.url);
        const scriptPath = join(COVERAGE_C8_TMP_SCRIPTS, url.pathname);

        url.port = '';
        url.protocol = 'file';
        url.host = '';
        url.pathname = scriptPath;

        /* Fix sources relative path from the temporary directory.
         * Otherwise, C8 will not find the original files. */
        const sourceMap = await tryFetchSourceMap(entry.url);
        const relativePath = relative(dirname(scriptPath), workspaceRoot);
        if (
          sourceMap &&
          typeof sourceMap === 'object' &&
          'sources' in sourceMap
        ) {
          sourceMap.sources = sourceMap.sources.map((source) => {
            if (
              source &&
              !source?.startsWith('/') &&
              !source?.includes('://')
            ) {
              return join(relativePath, source);
            }

            return source;
          });
        }

        /* Copy scripts and sourcemaps to temporary directory.
         * Otherwise, C8 will not find the sourcemap. */
        await forceWriteFile(scriptPath, entry.source);
        if (sourceMap) {
          await forceWriteFile(`${scriptPath}.map`, JSON.stringify(sourceMap));
        }

        return {
          ...entry,
          url: url.toString(),
        };
      }),
    );

    await forceWriteJsonFile(
      join(COVERAGE_C8_TMP_DIR, `coverage-${this._parallelIndex}.json`),
      {
        result: entries,
      },
    );
  }
}

const COVERAGE_C8_TMP_SCRIPTS = join(
  workspaceRoot,
  'dist',
  'coverage-c8-scripts',
);
const COVERAGE_C8_TMP_DIR = join(workspaceRoot, 'dist', 'coverage-c8-tmp');
