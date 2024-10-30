import { CreateNodesV2, ProjectConfiguration } from '@nx/devkit';
import { dirname, join } from 'path/posix';

export const createNodesV2 = createImplicitLibNode({
  pattern: 'libs/*/*/index.ts',
  createNode({ projectRoot }) {
    return {};
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
