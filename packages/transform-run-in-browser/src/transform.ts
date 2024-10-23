import { dirname, join, relative } from 'node:path/posix';
import type { PluginObj } from '@babel/core';
import generate from '@babel/generator';
import { declare } from '@babel/helper-plugin-utils';
import * as T from '@babel/types';
import { TransformContext } from './transform-context';
import { ExtractedFunctionsWriter } from './writer';
import { FileRepository, FileRepositoryImpl } from './file-repository';
import { generateUniqueFunctionName } from './utils/generate-unique-function-name';

export default declare<Options>(({ assertVersion, types: t }, options) => {
  assertVersion(7);

  const { projectRoot } = options;
  const { fileRepository = new FileRepositoryImpl() } =
    options as TestingOptions;
  const writer = new ExtractedFunctionsWriter({
    fileRepository,
    generatedDirectoryPath: 'playwright/generated',
    projectRoot,
    types: t,
  });

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

          writer.writeExtractedFunctions(ctx);

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

          /* Note that we are entering a `runInBrowserCall`. */
          if (
            t.isIdentifier(path.node.callee, { name: 'runInBrowser' }) &&
            !ctx.isInRunInBrowserCall()
          ) {
            ctx.enterRunInBrowserCall(path.node);
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
            path: ctx.relativeFilePath,
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
