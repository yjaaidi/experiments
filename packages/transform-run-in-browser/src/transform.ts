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
import { dirname } from 'node:path';

export default declare<Options>(({ assertVersion, types: t }, options) => {
  assertVersion(7);

  const { projectRoot } = options;
  const { fileRepository = new FileRepositoryImpl() } =
    options as TestingOptions;
  const testServerRoot = join(projectRoot, 'playwright-test-server');

  let ctx: TransformContext | undefined;

  return {
    name: 'transform-run-in-browser',
    visitor: {
      Program: {
        enter(_, state) {
          if (state.filename) {
            const relativeFilePath = relative(projectRoot, state.filename);
            ctx = new TransformContext(relativeFilePath);
          }
        },
        exit() {
          if (!ctx) {
            return;
          }

          writeExtractedFunctions({
            ctx,
            fileRepository,
            projectRoot,
            testServerRoot,
            types: t,
          });

          removeUnusedImportSpecifiers({
            ctx,
            types: t,
          });
        },
      },
      ImportDeclaration(path) {
        ctx?.addImport(path);
      },
      CallExpression: {
        enter(path) {
          if (!ctx) {
            return;
          }

          /* Skip if we are already in a `runInBrowserCall`. */
          if (
            t.isIdentifier(path.node.callee, { name: 'runInBrowser' }) &&
            !ctx.isInRunInBrowserCall()
          ) {
            ctx.enterInRunInBrowser(path.node);
          }
        },
        exit(path) {
          if (!ctx || path.node !== ctx.currentRunInBrowserCall) {
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
        if (!ctx || !ctx.isInRunInBrowserCall()) {
          return;
        }

        const binding = path.scope.getBinding(path.node.name);
        if (
          t.isImportSpecifier(binding?.path.node) &&
          t.isImportDeclaration(binding?.path.parentPath?.node)
        ) {
          ctx.addIdentifierUsedInRunInBrowser({
            specifier: binding?.path.node,
            source: binding?.path.parentPath.node.source.value,
          });
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
  #imports: NodePath<T.ImportDeclaration>[] = [];
  #currentRunInBrowserCall: T.CallExpression | null = null;
  #extractedFunctions: ExtractedFunctions[] = [];
  #identifiersToExtract: Array<{
    source: string;
    specifier: T.ImportSpecifier;
  }> = [];

  constructor(public readonly relativePath: string) {}

  get currentRunInBrowserCall() {
    return this.#currentRunInBrowserCall;
  }

  get extractedFunctions(): ReadonlyArray<ExtractedFunctions> {
    return this.#extractedFunctions;
  }

  get identifiersToExtract(): ReadonlyArray<{
    source: string;
    specifier: T.ImportSpecifier;
  }> {
    return this.#identifiersToExtract;
  }

  get imports(): ReadonlyArray<NodePath<T.ImportDeclaration>> {
    return this.#imports;
  }

  addExtractedFunction(extractedFunction: ExtractedFunctions) {
    this.#extractedFunctions.push(extractedFunction);
  }

  addIdentifierUsedInRunInBrowser({
    source,
    specifier,
  }: {
    source: string;
    specifier: T.ImportSpecifier;
  }) {
    this.#identifiersToExtract.push({
      source,
      specifier,
    });
  }

  isSpecifierUsedInRunInBrowser(specifier: T.ImportSpecifier) {
    return this.#identifiersToExtract.some(
      (item) => item.specifier === specifier,
    );
  }

  addImport(importPath: NodePath<T.ImportDeclaration>) {
    this.#imports.push(importPath);
  }

  isInRunInBrowserCall() {
    return this.#currentRunInBrowserCall != null;
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

function writeExtractedFunctions({
  ctx,
  fileRepository,
  projectRoot,
  testServerRoot,
  types,
}: {
  ctx: TransformContext;
  fileRepository: FileRepository;
  projectRoot: string;
  testServerRoot: string;
  types: typeof T;
}) {
  const { extractedFunctions, relativePath } = ctx;
  if (extractedFunctions.length === 0) {
    return;
  }

  const generatedTestFilePath = join(testServerRoot, relativePath);
  let testContent = '';

  /* Write extracted imports used by the extracted functions. */
  for (const [source, identifiers] of Object.entries(
    Object.groupBy(ctx.identifiersToExtract, (item) => item.source),
  )) {
    if (identifiers == null) {
      continue;
    }
    const specifiers = identifiers.map((item) => item.specifier);
    const relativeSource = source.startsWith('.')
      ? relative(
          dirname(generatedTestFilePath),
          join(projectRoot, dirname(relativePath), source),
        )
      : source;
    const importDeclaration = types.importDeclaration(
      specifiers,
      types.stringLiteral(relativeSource),
    );
    testContent += generate(importDeclaration).code + '\n';
  }

  /* Write extracted functions. */
  testContent += extractedFunctions.reduce(
    (content, { code, functionName }) => {
      return `${content}
export const ${functionName} = ${code};`;
    },
    '',
  );
  fileRepository.writeFile(join(testServerRoot, relativePath), testContent);

  /* Update main file with imports of extracted functions. */
  const mainContent = extractedFunctions.reduce((content, { functionName }) => {
    return `${content}
globalThis.${functionName} = async () => {
  const { ${functionName} } = await import('./${relativePath}');
  return ${functionName}();
};`;
  }, '');
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

function removeUnusedImportSpecifiers({
  ctx,
  types,
}: {
  ctx: TransformContext;
  types: typeof T;
}) {
  const { imports } = ctx;
  for (const importPath of imports) {
    importPath.node.specifiers = importPath.node.specifiers.filter(
      (specifier) => {
        return (
          types.isImportSpecifier(specifier) &&
          !ctx.isSpecifierUsedInRunInBrowser(specifier)
        );
      },
    );
    if (importPath.node.specifiers.length === 0) {
      importPath.remove();
    }
  }
}
