import { CoverageEntry } from './core';

export class CoverageCollector {
  private _coverageEntries: CoverageEntry[] = [];

  collect(coverageEntries: CoverageEntry[]) {
    this._coverageEntries = [...this._coverageEntries, ...coverageEntries];
  }

  getCoverageEntries() {
    return this._coverageEntries;
  }
}
