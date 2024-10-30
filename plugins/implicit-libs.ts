import { CreateNodesV2, ProjectConfiguration } from '@nx/devkit';
import { dirname, join } from 'path/posix';

export const createNodesV2 = createImplicitLibNode({
  pattern: 'libs/*/*/index.ts',
  createNode({ projectRoot }) {
    const [libsPath, scope, shortName] = projectRoot.split('/');
    const type = shortName.split('-')[0];
    const name = `${scope}-${shortName}`;
    return {
      name,
      projectType: 'library',
      tags: [`scope:${scope}`, `type:${type}`, `name:${name}`],
      targets: {
        lint: {
          executor: '@nx/eslint:lint',
          options: {
            eslintConfig: join(libsPath, 'eslint.config.js'),
            lintFilePatterns: [`${projectRoot}/**/*.ts`],
          },
        },
        test: {
          command: 'vitest',
          options: {
            cwd: projectRoot,
          },
        },
      },
    };
  },
});

function createImplicitLibNode({
  pattern,
  createNode,
}: {
  pattern: string;
  createNode: (node: {
    projectRoot: string;
  }) => Omit<ProjectConfiguration, 'root'>;
}): CreateNodesV2 {
  return [
    pattern,
    (filePathList) =>
      filePathList.map((filePath) => {
        const projectRoot = dirname(filePath);
        return [
          filePath,
          {
            projects: {
              [projectRoot]: createNode({
                projectRoot: projectRoot,
              }),
            },
          },
        ];
      }),
  ];
}
