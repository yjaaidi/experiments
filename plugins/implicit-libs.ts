import { CreateNodesV2, ProjectConfiguration } from '@nx/devkit';
import { dirname, join } from 'path/posix';

export const createNodesV2 = createImplicitNodes({
  pattern: 'libs/*/*/index.ts',
  createNode({ projectRoot }) {
    return {
      name: 'TODO',
    };
  },
});

function createImplicitNodes({
  pattern,
  createNode,
}: {
  pattern: string;
  createNode: (node: {
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
              [projectRoot]: createNode({
                projectRoot: projectRoot,
              }),
            },
          },
        ];
      }),
  ];
}
