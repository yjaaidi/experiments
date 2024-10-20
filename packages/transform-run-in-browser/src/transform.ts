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

  let currentFile: CurrentFileContext;
  let currentRunInBrowserCall: T.CallExpression | null = null;

  return {
    name: 'transform-run-in-browser',
    visitor: {
      Program: {
        enter(_, state) {
          const relativeFilePath = relative(projectRoot, state.filename);
          currentFile = new CurrentFileContext(relativeFilePath);
        },
        exit() {
          /* Remove imports that were used in extracted functions. */
          for (const importPath of currentFile.imports) {
            importPath.node.specifiers = importPath.node.specifiers.filter(
              (specifier) => {
                return (
                  t.isImportSpecifier(specifier) &&
                  !currentFile.identifiersUsedInRunInBrowser.has(specifier)
                );
              },
            );
            if (importPath.node.specifiers.length === 0) {
              importPath.remove();
            }
          }

          /* Write extracted functions. */
          const extractedFunctions = currentFile.extractedFunctions;
          if (extractedFunctions.length > 0) {
            const mainContent = currentFile.extractedFunctions.reduce(
              (content, { functionName }) => {
                return `${content}
globalThis.${functionName} = async () => {
  const { ${functionName} } = await import('./${currentFile.relativePath}');
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
              join(testServerRoot, currentFile.relativePath),
              testContent,
            );
          }
        },
      },
      ImportDeclaration(path) {
        currentFile.addImport(path);
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
            path: currentFile.relativePath,
          });
          currentFile.addExtractedFunction({
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
          currentFile.addIdentifierUsedInRunInBrowser(binding?.path.node);
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

class CurrentFileContext {
  readonly extractedFunctions: ExtractedFunctions[] = [];
  readonly imports: NodePath<T.ImportDeclaration>[] = [];
  readonly identifiersUsedInRunInBrowser: Set<T.ImportSpecifier> = new Set();

  constructor(public readonly relativePath: string) {}

  addExtractedFunction(extractedFunction: ExtractedFunctions) {
    this.extractedFunctions.push(extractedFunction);
  }

  addIdentifierUsedInRunInBrowser(identifier: T.ImportSpecifier) {
    this.identifiersUsedInRunInBrowser.add(identifier);
  }

  addImport(importPath: NodePath<T.ImportDeclaration>) {
    this.imports.push(importPath);
  }
}

interface ExtractedFunctions {
  code: string;
  functionName: string;
}
