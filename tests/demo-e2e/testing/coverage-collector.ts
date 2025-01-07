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
    const coverageTmpDir = join(workspaceRoot, 'coverage', 'tmp');
    await mkdir(coverageTmpDir, { recursive: true });
    const filePath = join(
      coverageTmpDir,
      `coverage-${this._parallelIndex}.json`,
    );
    await writeFile(
      filePath,
      JSON.stringify({
        result: this._coverageEntries,
        timestamp: Date.now() / 10_000_000,
      }),
    );
  }
}

export type CoverageEntry = Awaited<ReturnType<Coverage['stopJSCoverage']>>[0];
