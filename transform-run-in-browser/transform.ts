import type { NodePath, PluginObj } from '@babel/core';
import * as T from '@babel/types';
import { declare } from '@babel/helper-plugin-utils';
import { spec } from 'node:test/reporters';

export default declare(({ assertVersion, types: t }) => {
  assertVersion(7);

  let currentRunInBrowserCall: T.CallExpression | null = null;
  let importPaths: NodePath<T.ImportDeclaration>[] = [];
  let identifiersUsedInRunInBrowser: Set<T.ImportSpecifier> = new Set();

  return {
    name: 'transform-run-in-browser',
    visitor: {
      Program: {
        enter() {
          importPaths = []; // Reset imports for each file
        },
        exit() {
          for (const importPath of importPaths) {
            console.log(identifiersUsedInRunInBrowser);
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
