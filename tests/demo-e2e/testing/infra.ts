import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path/posix';
import { debug } from 'debug';
import type { SourceMapInput } from '@jridgewell/trace-mapping';

const log = debug('coverage');

export async function tryFetchSourceMap(
  url: string,
): Promise<SourceMapInput | undefined> {
  try {
    const response = await fetch(`${url}.map`);
    return await response.json();
  } catch {
    log(`Failed to fetch source map for ${url}`);
    return;
  }
}

export async function forceWriteJsonFile(
  filePath: string,
  data: unknown,
): Promise<void> {
  await forceWriteFile(filePath, JSON.stringify(data));
}

export async function forceWriteFile(
  filePath: string,
  data: string,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, data, 'utf-8');
}
