import { dirname, join, relative } from 'node:path/posix';
import * as T from '@babel/types';
import generate from '@babel/generator';
import { TransformContext } from './transform-context';
import { FileRepository } from './utils';

export class ExtractedFunctionsWriter {
  #fileRepository: FileRepository;
  #generatedDirectoryRoot: string;
  #projectRoot: string;
  #types: typeof T;

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
    this.#fileRepository = fileRepository;
    this.#generatedDirectoryRoot = join(projectRoot, generatedDirectoryPath);
    this.#projectRoot = projectRoot;
    this.#types = types;
  }

  writeExtractedFunctions(ctx: TransformContext) {
    const t = this.#types;
    const { extractedFunctions, relativePath } = ctx;
    if (extractedFunctions.length === 0) {
      return;
    }

    const generatedTestFilePath = join(
      this.#generatedDirectoryRoot,
      relativePath,
    );
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
            join(this.#projectRoot, dirname(relativePath), source),
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
    this.#fileRepository.writeFile(
      join(this.#generatedDirectoryRoot, relativePath),
      testContent,
    );

    /* Update main file with imports of extracted functions. */
    const mainContent = extractedFunctions.reduce(
      (content, { functionName }) => {
        return `${content}
(globalThis as any).${functionName} = async () => {
  const { ${functionName} } = await import('./${relativePath.replace(
    /\.ts$/,
    '',
  )}');
  return ${functionName}();
};`;
      },
      '',
    );
    updateRegion({
      fileRepository: this.#fileRepository,
      filePath: join(this.#generatedDirectoryRoot, 'tests.ts'),
      region: 'src/recipe-search.spec.ts',
      content: `
// #region src/recipe-search.spec.ts
${mainContent}
// #endregion
`,
    });
  }
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
