import { Line } from '@demo/api-interfaces';
import { createReadStream } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { Observable } from 'rxjs';
import { walk } from 'walk';

export function getFiles(path: string): Observable<string> {
  return new Observable<string>(observer => {
    const walker = walk(path);
    walker.on('file', (directorypath, fileStats, next) => {
      observer.next(join(directorypath, fileStats.name));
      next();
    });
    walker.on('end', () => observer.complete());
    return () => walker.pause();
  });
}

export function readLines(filePath: string): Observable<Line> {
  return new Observable<Line>(observer => {
    const reader = createInterface({
      input: createReadStream(filePath)
    });
    let lineNumber = 1;
    reader.on('line', content =>
      observer.next({
        content,
        file: filePath,
        number: lineNumber++
      })
    );
    reader.on('close', () => observer.complete());
    return () => reader.close();
  });
}
