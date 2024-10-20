import { FileRepository } from './utils';

export class FileRepositoryFake implements FileRepository {
  private files = new Map<string, string>();

  async writeFile(filePath: string, content: string): Promise<void> {
    this.files.set(filePath, content);
  }

  readFile(filePath: string): string | undefined {
    return this.files.get(filePath);
  }
}
