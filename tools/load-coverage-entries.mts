import { workspaceRoot } from '@nx/devkit';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path/posix';

export async function loadCoverageEntries() {
  if (!existsSync(COVERAGE_TMP_DIR)) {
    throw new Error('No coverage data found.');
  }

  const files = await readdir(COVERAGE_TMP_DIR);

  const results = await Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map(async (file) => {
        const { result } = JSON.parse(
          await readFile(join(COVERAGE_TMP_DIR, file), 'utf-8'),
        );
        return result;
      }),
  );

  return results.flat();
}

const COVERAGE_TMP_DIR = join(workspaceRoot, 'dist', 'coverage-tmp');
