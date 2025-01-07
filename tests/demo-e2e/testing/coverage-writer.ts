import { CoverageEntry } from './core';

export interface CoverageWriter {
  write(coverageEntries: CoverageEntry[]): Promise<void>;
}
