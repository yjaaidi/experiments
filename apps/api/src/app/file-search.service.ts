import { SearchResult } from '@demo/api-interfaces';
import { getFiles, readLines } from '@demo/walker';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Observable } from 'rxjs';
import { bufferTime, filter, map, mergeMap, take } from 'rxjs/operators';

@Injectable()
export class FileSearch {
  private _file$ = getFiles(join(__dirname, '..', '..', '..', 'node_modules'))
    .pipe(filter(file => file.endsWith('.d.ts')));

  search(keywords: string): Observable<SearchResult> {

    const lines$ = this._file$.pipe(mergeMap(file => readLines(file)));

    return lines$.pipe(
      filter(line => line.content.includes(keywords)),
      bufferTime(5000),
      take(1),
      map(lines => ({
        items: lines
      }))
    );

  }
}
