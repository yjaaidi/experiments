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

  let currentRunInBrowserCall: T.CallExpression | null = null;
  let relativeFilePath: string | null = null;
  let importPaths: NodePath<T.ImportDeclaration>[] = [];
  let identifiersUsedInRunInBrowser: Set<T.ImportSpecifier> = new Set();

  return {
    name: 'transform-run-in-browser',
    visitor: {
      Program: {
        enter(_, state) {
          relativeFilePath = state.filename?.replace(projectRoot, '');

          importPaths = [];
        },
        exit() {
          relativeFilePath = null;

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

          const code = generate(path.node.arguments[0]).code;

          const identifier = t.stringLiteral(
            generateUniqueFunctionName({
              code,
              path: relativeFilePath,
            }),
          );
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
