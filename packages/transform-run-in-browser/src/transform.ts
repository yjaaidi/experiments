import { join, relative } from 'node:path/posix';
import type { NodePath, PluginObj } from '@babel/core';
import generate from '@babel/generator';
import { declare } from '@babel/helper-plugin-utils';
import * as T from '@babel/types';
import {
  generateUniqueFunctionName,
  FileRepository,
  FileRepositoryImpl,
} from './utils';

export default declare<Options>(({ assertVersion, types: t }, options) => {
  assertVersion(7);

  const { projectRoot } = options;
  const { fileRepository = new FileRepositoryImpl() } =
    options as TestingOptions;
  const testServerRoot = join(projectRoot, 'playwright-test-server');

  let currentRunInBrowserCall: T.CallExpression | null = null;
  let relativeFilePath: string | null = null;
  let importPaths: NodePath<T.ImportDeclaration>[] = [];
  let identifiersUsedInRunInBrowser: Set<T.ImportSpecifier> = new Set();
  let extractedFunctions: ExtractedFunctions[] = [];

  return {
    name: 'transform-run-in-browser',
    visitor: {
      Program: {
        enter(_, state) {
          relativeFilePath = relative(projectRoot, state.filename);

          importPaths = [];
          extractedFunctions = [];
        },
        exit() {
          /* Remove imports that were used in extracted functions. */
          for (const importPath of importPaths) {
            importPath.node.specifiers = importPath.node.specifiers.filter(
              (specifier) => {
                return (
                  t.isImportSpecifier(specifier) &&
                  !identifiersUsedInRunInBrowser.has(specifier)
                );
              },
            );
            if (importPath.node.specifiers.length === 0) {
              importPath.remove();
            }
          }

          /* Write extracted functions. */
          const mainContent = extractedFunctions.reduce(
            (content, { functionName }) => {
              return `${content}
globalThis.${functionName} = async () => {
  const { ${functionName} } = await import('./${relativeFilePath}');
  return ${functionName}();
};`;
            },
            '',
          );

          const testContent = extractedFunctions.reduce(
            (content, { code, functionName }) => {
              return `${content}
export const ${functionName} = ${code};`;
            },
            '',
          );

          fileRepository.writeFile(
            join(testServerRoot, 'main.ts'),
            `
// src/recipe-search.spec.ts start
${mainContent}
// src/recipe-search.spec.ts end
`,
          );

          fileRepository.writeFile(
            join(testServerRoot, relativeFilePath),
            testContent,
          );

          relativeFilePath = null;
        },
      },
      ImportDeclaration(path) {
        importPaths.push(path);
      },
      CallExpression: {
        enter(path) {
          if (t.isIdentifier(path.node.callee, { name: 'runInBrowser' })) {
            currentRunInBrowserCall = path.node;
          }
        },
        exit(path) {
          if (path.node !== currentRunInBrowserCall) {
            return;
          }

          /* Extract function to write it on program exit. */
          const code = generate(path.node.arguments[0]).code;
          const functionName = generateUniqueFunctionName({
            code,
            path: relativeFilePath,
          });
          extractedFunctions.push({
            code,
            functionName,
          });

          /* Replace arguments with a string that will be forwarded to the browser. */
          const identifier = t.stringLiteral(functionName);
          path.node.arguments = [identifier];

          currentRunInBrowserCall = null;
        },
      },
      Identifier(path) {
        if (!currentRunInBrowserCall) {
          return;
        }

        const binding = path.scope.getBinding(path.node.name);
        if (t.isImportSpecifier(binding?.path.node)) {
          identifiersUsedInRunInBrowser.add(binding?.path.node);
        }
      },
    },
  } satisfies PluginObj;
});

export interface Options {
  projectRoot: string;
}

export interface TestingOptions extends Options {
  fileRepository: FileRepository;
}

interface ExtractedFunctions {
  code: string;
  functionName: string;
}
