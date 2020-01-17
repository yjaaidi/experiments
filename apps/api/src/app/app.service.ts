import { SearchResult } from '@demo/api-interfaces';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Observable } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { walk } from 'walk';

@Injectable()
export class AppService {
  private _files$ = new Observable(observer => {
    const walker = walk(join(__dirname, '..', '..', '..', 'apps'));
    walker.on('file', (_, fileStats, next) => {
      observer.next(fileStats.name);
      next();
    });
    walker.on('end', () => observer.complete());
  });

  getData(): Observable<SearchResult> {
    return this._files$.pipe(
      reduce((acc, fileName) => [...acc, fileName], []),
      map(fileNameList => {
        return {
          files: fileNameList.map(fileName => ({ fileName, matchCount: 0 }))
        };
      })
    );
  }
}
