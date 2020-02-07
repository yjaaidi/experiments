import { SearchResult } from '@demo/api-interfaces';
import { getFiles, readLines } from '@demo/walker';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { bufferTime, filter, map, mergeMap, take } from 'rxjs/operators';

@Injectable()
export class FileSearch {
  private _file$ = getFiles(
    join(__dirname, '..', '..', '..', 'node_modules')
  ).pipe(filter(file => file.endsWith('.d.ts')));

  search(keywords: string): Observable<SearchResult> {
    return of({items: []});
  }
}
