import MCR from 'monocart-coverage-reports';
import { loadCoverageEntries } from './load-coverage-entries.mts';

async function main() {
  const mcr = MCR({
    outputDir: 'coverage',
    reports: ['html', 'text'],
    sourceFilter: {
      '**/node_modules/**': false,
      '**': true,
    },
  });

  await mcr.add(await loadCoverageEntries());
  await mcr.generate();
}

main();
