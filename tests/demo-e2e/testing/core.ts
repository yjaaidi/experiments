import { Coverage } from '@playwright/test';

export interface CoverageReporter {
  writeReport(coverageEntries: CoverageEntry[]): Promise<void>;
}

export class CoverageCollector {
  private _coverageEntries: CoverageEntry[] = [];

  collect(coverageEntries: CoverageEntry[]) {
    this._coverageEntries = [...this._coverageEntries, ...coverageEntries];
  }

  getCoverageEntries() {
    return this._coverageEntries;
  }
}

export type CoverageEntry = Awaited<ReturnType<Coverage['stopJSCoverage']>>[0];
