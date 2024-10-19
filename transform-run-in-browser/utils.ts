import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

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
  writeFile(filePath: string, content: string): void;
}

export class FileRepositoryImpl implements FileRepository {
  writeFile(filePath: string, content: string): void {
    const parentPath = dirname(filePath);
    mkdirSync(parentPath, { recursive: true });
    writeFileSync(filePath, content, 'utf-8');
  }
}
