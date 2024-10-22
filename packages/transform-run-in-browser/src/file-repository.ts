import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export interface FileRepository {
  tryReadFile(filePath: string): string | null;

  writeFile(filePath: string, content: string): void;
}

export class FileRepositoryImpl implements FileRepository {
  tryReadFile(filePath: string): string | null {
    try {
      return readFileSync(filePath, 'utf-8');
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === 'ENOENT') {
        return null;
      }
      throw e;
    }
  }

  writeFile(filePath: string, content: string): void {
    const parentPath = dirname(filePath);
    mkdirSync(parentPath, { recursive: true });
    writeFileSync(filePath, content, 'utf-8');
  }
}
