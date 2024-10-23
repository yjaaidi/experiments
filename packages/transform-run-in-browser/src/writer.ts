import { dirname, join, relative } from 'node:path/posix';
import * as T from '@babel/types';
import generate from '@babel/generator';
import { TransformContext } from './transform-context';

import { FileRepository } from './file-repository';
import { updateRegion } from './utils/update-region';
import { ParseResult, traverse } from '@babel/core';

export class ExtractedFunctionsWriter {
  private _babelParse: (code: string) => ParseResult | null;
  private _fileRepository: FileRepository;
  private _generatedDirectoryRoot: string;
  private _projectRoot: string;
  private _types: typeof T;

  constructor({
    babelParse,
    fileRepository,
    generatedDirectoryPath,
    projectRoot,
    types,
  }: {
    babelParse: (code: string) => ParseResult | null;
    fileRepository: FileRepository;
    generatedDirectoryPath: string;
    projectRoot: string;
    types: typeof T;
  }) {
    this._babelParse = babelParse;
    this._fileRepository = fileRepository;
    this._generatedDirectoryRoot = join(projectRoot, generatedDirectoryPath);
    this._projectRoot = projectRoot;
    this._types = types;
  }

  writeExtractedFunctions(ctx: TransformContext) {
    const { extractedFunctions, relativeFilePath } = ctx;
    if (extractedFunctions.length === 0) {
      return;
    }

    this._fileRepository.writeFile(
      join(this._generatedDirectoryRoot, relativeFilePath),
      this._generateTestContent(ctx),
    );

    const entryPointPath = join(this._generatedDirectoryRoot, 'index.ts');
    // TODO create a lock file to avoid concurrent updates
    let entryPointContent = this._fileRepository.tryReadFile(entryPointPath);
    entryPointContent = this._updateEntryPoint({ ctx, entryPointContent });
    this._fileRepository.writeFile(entryPointPath, entryPointContent);
  }

  private _generateTestContent(ctx: TransformContext) {
    const t = this._types;

    let testContent = '';

    for (const [source, identifiers] of Object.entries(
      Object.groupBy(ctx.identifiersToExtract, (item) => item.source),
    )) {
      if (identifiers == null) {
        continue;
      }
      const specifiers = new Set(identifiers.map((item) => item.specifier));
      const newImportSource = this._computeNewImportSource({
        ctx,
        importSource: source,
      });
      const importDeclaration = t.importDeclaration(
        Array.from(specifiers),
        t.stringLiteral(newImportSource),
      );
      testContent += generate(importDeclaration).code + '\n';
    }

    /* Write extracted functions. */
    testContent += ctx.extractedFunctions
      .map(({ code, functionName }) => {
        code = this._fixAsyncImportRelativePath({
          ctx,
          code,
        });

        return `export const ${functionName} = ${code}`;
      })
      .join('\n');

    return testContent;
  }

  private _updateEntryPoint({
    ctx,
    entryPointContent,
  }: {
    ctx: TransformContext;
    entryPointContent: string | null;
  }) {
    const { extractedFunctions, relativeFilePath } = ctx;
    const importPath = './' + relativeFilePath.replace(/\.ts$/, '');

    entryPointContent ??= 'export {};';

    const regionContent = extractedFunctions
      .map(({ functionName }) => {
        return `\
(globalThis as any).${functionName} = async (args) => {
  const { ${functionName} } = await import('${importPath}');
  return (${functionName} as any)(args);
};`;
      })
      .join('\n');

    return updateRegion({
      fileContent: entryPointContent,
      region: relativeFilePath,
      regionContent: regionContent,
    });
  }

  private _fixAsyncImportRelativePath({
    ctx,
    code,
  }: {
    ctx: TransformContext;
    code: string;
  }) {
    const t = this._types;

    const ast = this._babelParse(code);

    if (!ast) {
      return code;
    }

    traverse(ast, {
      CallExpression: (path) => {
        if (
          t.isImport(path.node.callee) &&
          t.isStringLiteral(path.node.arguments[0])
        ) {
          path.node.arguments[0].value = this._computeNewImportSource({
            ctx,
            importSource: path.node.arguments[0].value,
          });
        }
      },
    });
    return generate(ast).code;
  }

  private _computeNewImportSource({
    ctx,
    importSource,
  }: {
    ctx: TransformContext;
    importSource: string;
  }) {
    if (!importSource.startsWith('.')) {
      return importSource;
    }

    const generatedTestFilePath = join(
      this._generatedDirectoryRoot,
      ctx.relativeFilePath,
    );

    return relative(
      dirname(generatedTestFilePath),
      join(this._projectRoot, dirname(ctx.relativeFilePath), importSource),
    );
  }
}
