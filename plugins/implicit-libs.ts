import { CreateNodesV2, ProjectConfiguration } from '@nx/devkit';
import { dirname, join } from 'node:path';

export const createNodesV2: CreateNodesV2 = [
  'libs/*/*/index.ts',
  (indexFiles) =>
    indexFiles.map((indexFile) => {
      const [libsDir, scope, shortName] = indexFile.split('/');
      const type = shortName.split('-')[0];
      const projectRoot = dirname(indexFile);
      const name = `${scope}-${shortName}`;

      return [
        indexFile,
        {
          projects: {
            [projectRoot]: {
              projectType: 'library',
              name,
              tags: [`scope:${scope}`, `type:${type}`, `name:${name}`],
              targets: {
                lint: {
                  command: 'eslint .',
                  options: {
                    cwd: projectRoot,
                  },
                },
                test: {
                  command: 'vitest',
                  options: {
                    cwd: projectRoot,
                  },
                },
              },
            } satisfies Partial<ProjectConfiguration>,
          },
        },
      ] as const;
    }),
];
