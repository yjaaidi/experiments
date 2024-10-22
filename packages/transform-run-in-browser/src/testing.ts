import { FileRepository } from './file-repository';

export class FileRepositoryFake implements FileRepository {
  private files = new Map<string, string>();

  async writeFile(filePath: string, content: string): Promise<void> {
    this.files.set(filePath, content);
  }

  tryReadFile(filePath: string): string | null {
    return this.files.get(filePath) ?? null;
  }
}
