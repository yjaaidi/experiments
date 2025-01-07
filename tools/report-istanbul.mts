import { workspaceRoot } from '@nx/devkit';
import istanbulLibCoverage from 'istanbul-lib-coverage';
import istanbulLibReport from 'istanbul-lib-report';
import istanbulReports from 'istanbul-reports';
import { join, relative } from 'node:path/posix';
import v8toIstanbul from 'v8-to-istanbul';
import { loadCoverageEntries } from './load-coverage-entries.mts';

async function main() {
  const coverageMap = istanbulLibCoverage.createCoverageMap();

  for (const entry of await loadCoverageEntries()) {
    if (entry.source === undefined) {
      console.warn(`No source for entry: ${entry.url}`);
      continue;
    }

    const converter = v8toIstanbul(entry.url, 0, {
      source: entry.source,
    });
    await converter.load();
    converter.applyCoverage(entry.functions);
    coverageMap.merge(converter.toIstanbul());
    converter.destroy();
  }

  coverageMap.filter((file) => {
    const relativePath = relative(workspaceRoot, file);

    if (relativePath.includes('node_modules')) {
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
  istanbulReports.create('text').execute(context);
}

main();
