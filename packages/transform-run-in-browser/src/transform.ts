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

  let ctx: TransformContext;

  return {
    name: 'transform-run-in-browser',
    visitor: {
      Program: {
        enter(_, state) {
          const relativeFilePath = relative(projectRoot, state.filename);
          ctx = new TransformContext(relativeFilePath);
        },
        exit() {
          /* Remove imports that were used in extracted functions. */
          for (const importPath of ctx.imports) {
            importPath.node.specifiers = importPath.node.specifiers.filter(
              (specifier) => {
                return (
                  t.isImportSpecifier(specifier) &&
                  !ctx.identifiersUsedInRunInBrowser.has(specifier)
                );
              },
            );
            if (importPath.node.specifiers.length === 0) {
              importPath.remove();
            }
          }

          /* Write extracted functions. */
          const extractedFunctions = ctx.extractedFunctions;
          if (extractedFunctions.length > 0) {
            const mainContent = ctx.extractedFunctions.reduce(
              (content, { functionName }) => {
                return `${content}
globalThis.${functionName} = async () => {
  const { ${functionName} } = await import('./${ctx.relativePath}');
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
              join(testServerRoot, ctx.relativePath),
              testContent,
            );

            updateRegion({
              fileRepository,
              filePath: join(testServerRoot, 'main.ts'),
              region: 'src/recipe-search.spec.ts',
              content: `
// #region src/recipe-search.spec.ts
${mainContent}
// #endregion
`,
            });
          }
        },
      },
      ImportDeclaration(path) {
        ctx.addImport(path);
      },
      CallExpression: {
        enter(path) {
          /* Skip if we are already in a `runInBrowserCall`. */
          if (
            t.isIdentifier(path.node.callee, { name: 'runInBrowser' }) &&
            !ctx.isInRunInBrowserCall()
          ) {
            ctx.enterInRunInBrowser(path.node);
          }
        },
        exit(path) {
          if (path.node !== ctx.currentRunInBrowserCall) {
            return;
          }

          /* Extract function to write it on program exit. */
          const code = generate(path.node.arguments[0]).code;
          const functionName = generateUniqueFunctionName({
            code,
            path: ctx.relativePath,
          });
          ctx.addExtractedFunction({
            code,
            functionName,
          });

          /* Replace arguments with a string that will be forwarded to the browser. */
          const identifier = t.stringLiteral(functionName);
          path.node.arguments = [identifier];

          ctx.exitRunInBrowserCall();
        },
      },
      Identifier(path) {
        if (!ctx.isInRunInBrowserCall()) {
          return;
        }

        const binding = path.scope.getBinding(path.node.name);
        if (t.isImportSpecifier(binding?.path.node)) {
          ctx.addIdentifierUsedInRunInBrowser(binding?.path.node);
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

class TransformContext {
  #extractedFunctions: ExtractedFunctions[] = [];
  #imports: NodePath<T.ImportDeclaration>[] = [];
  #identifiersUsedInRunInBrowser: Set<T.ImportSpecifier> = new Set();
  #currentRunInBrowserCall: T.CallExpression;

  get currentRunInBrowserCall() {
    return this.#currentRunInBrowserCall;
  }

  get extractedFunctions(): ReadonlyArray<ExtractedFunctions> {
    return this.#extractedFunctions;
  }

  get identifiersUsedInRunInBrowser(): ReadonlySet<T.ImportSpecifier> {
    return this.#identifiersUsedInRunInBrowser;
  }

  get imports(): ReadonlyArray<NodePath<T.ImportDeclaration>> {
    return this.#imports;
  }
  constructor(public readonly relativePath: string) {}

  addExtractedFunction(extractedFunction: ExtractedFunctions) {
    this.#extractedFunctions.push(extractedFunction);
  }

  addIdentifierUsedInRunInBrowser(identifier: T.ImportSpecifier) {
    this.#identifiersUsedInRunInBrowser.add(identifier);
  }

  addImport(importPath: NodePath<T.ImportDeclaration>) {
    this.#imports.push(importPath);
  }

  isInRunInBrowserCall() {
    return this.#currentRunInBrowserCall !== undefined;
  }

  enterInRunInBrowser(call: T.CallExpression) {
    this.#currentRunInBrowserCall = call;
  }

  exitRunInBrowserCall() {
    this.#currentRunInBrowserCall = null;
  }
}

interface ExtractedFunctions {
  code: string;
  functionName: string;
}

function updateRegion({
  fileRepository,
  filePath,
  region,
  content,
}: {
  fileRepository: FileRepository;
  filePath: string;
  region: string;
  content: string;
}) {
  let fileContent = fileRepository.tryReadFile(filePath);

  if (fileContent) {
    const regionStart = `// #region ${region}`;
    const regionEnd = `// #endregion`;

    const startIndex = fileContent.indexOf(regionStart);
    const endIndex = fileContent.indexOf(regionEnd, startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
      fileContent =
        fileContent.slice(0, startIndex + regionStart.length) +
        fileContent.slice(endIndex + regionEnd.length);
    }
  }

  const updatedContent = `${fileContent}\n${content}`;

  fileRepository.writeFile(filePath, updatedContent);
}
