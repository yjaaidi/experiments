import { workspaceRoot } from '@nx/devkit';
import { join } from 'node:path/posix';
import { CoverageEntry } from './core';
import { CoverageWriter } from './coverage-writer';
import { tryFetchSourceMap, forceWriteJsonFile } from './infra';

export class CoverageWriterImpl implements CoverageWriter {
  constructor(private _parallelIndex: number) {}

  async write(coverageEntries: CoverageEntry[]): Promise<void> {
    const entries = await Promise.all(
      coverageEntries.map(async (entry) => {
        return {
          ...entry,
          sourceMap: await tryFetchSourceMap(entry.url),
        };
      }),
    );

    await forceWriteJsonFile(
      join(COVERAGE_TMP_DIR, `coverage-${this._parallelIndex}.json`),
      { result: entries },
    );
  }
}

export const COVERAGE_TMP_DIR = join(workspaceRoot, 'dist', 'coverage-tmp');
