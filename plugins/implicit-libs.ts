import { CreateNodesV2, ProjectConfiguration } from '@nx/devkit';
import { dirname, join } from 'path/posix';

export const createNodesV2 = createImplicitNodes({
  pattern: 'libs/*/*/index.ts',
  createProjectConfiguration({ projectRoot }) {
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

function createImplicitNodes({
  pattern,
  createProjectConfiguration,
}: {
  pattern: string;
  createProjectConfiguration: (node: {
    projectRoot: string;
  }) => Omit<ProjectConfiguration, 'root'> &
    Required<Pick<ProjectConfiguration, 'name'>>;
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
              [projectRoot]: createProjectConfiguration({
                projectRoot,
              }),
            },
          },
        ];
      }),
  ];
}
