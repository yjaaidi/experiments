import { dirname, join, relative } from 'node:path/posix';
import * as T from '@babel/types';
import generate from '@babel/generator';
import { TransformContext } from './transform-context';

import { FileRepository } from './file-repository';
import { updateRegion } from './utils/update-region';

export class ExtractedFunctionsWriter {
  private _fileRepository: FileRepository;
  private _generatedDirectoryRoot: string;
  private _projectRoot: string;
  private _types: typeof T;

  constructor({
    fileRepository,
    generatedDirectoryPath,
    projectRoot,
    types,
  }: {
    fileRepository: FileRepository;
    generatedDirectoryPath: string;
    projectRoot: string;
    types: typeof T;
  }) {
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

    const entryPointPath = join(this._generatedDirectoryRoot, 'tests.ts');
    // TODO create a lock file to avoid concurrent updates
    let entryPointContent = this._fileRepository.tryReadFile(entryPointPath);
    entryPointContent = this._updateEntryPoint({ ctx, entryPointContent });
    this._fileRepository.writeFile(entryPointPath, entryPointContent);
  }

  private _generateTestContent(ctx: TransformContext) {
    const t = this._types;
    const { relativeFilePath, extractedFunctions } = ctx;

    let testContent = '';

    const generatedTestFilePath = join(
      this._generatedDirectoryRoot,
      relativeFilePath,
    );

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
            join(this._projectRoot, dirname(relativeFilePath), source),
          )
        : source;
      const importDeclaration = t.importDeclaration(
        specifiers,
        t.stringLiteral(relativeSource),
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
(globalThis as any).${functionName} = async () => {
  const { ${functionName} } = await import('${importPath}');
  return ${functionName}();
};`;
      })
      .join('\n');

    return updateRegion({
      fileContent: entryPointContent,
      region: relativeFilePath,
      regionContent: regionContent,
    });
  }
}
