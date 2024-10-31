import { CreateNodesV2, ProjectConfiguration } from '@nx/devkit';
import { dirname, join } from 'path/posix';

export const createNodesV2 = createImplicitNodes({
  pattern: 'libs/*/*/index.ts',
  createProjectConfiguration({ projectRoot }) {
    return {
      name: 'TODO',
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
