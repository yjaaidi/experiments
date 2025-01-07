import MCR from 'monocart-coverage-reports';
import { loadCoverageEntries } from './load-coverage-entries.mts';

async function main() {
  const mcr = MCR({
    outputDir: 'coverage',
    reports: ['html', 'text'],
    entryFilter: {
      '.angular/cache': false,
      client: false,
      'env.mjs': false,
      '**': true,
    },
    sourceFilter: {
      '**/node_modules/**': false,
      '**': true,
    },
  });

  await mcr.add(await loadCoverageEntries());
  await mcr.generate();
}

main();
