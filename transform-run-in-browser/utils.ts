import { createHash } from 'node:crypto';

export function generateUniqueFunctionName({
  code,
  path,
}: {
  code: string;
  path: string;
}) {
  const slug = path.replaceAll(/[^\w]/g, '_').replace(/^_/, '');
  const hash = createHash('sha256')
    .update(code)
    .digest('base64')
    .substring(0, 6);
  return `${slug}_${hash}`;
}

export interface FileRepository {
  writeFile(filePath: string, content: string): Promise<void>;
}

export class FileRepositoryImpl implements FileRepository {
  /**
   * @deprecated 🚧 Work in progress.
   */
  writeFile(filePath: string, content: string): Promise<void> {
    throw new Error('🚧 Work in progress!');
  }
}
