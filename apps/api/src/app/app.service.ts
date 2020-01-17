import { SearchResult } from '@demo/api-interfaces';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { bindCallback, defer, Observable } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { walk } from 'walk';

@Injectable()
export class AppService {
  private _file$ = new Observable(observer => {
    const rootPath = join(__dirname, '..', '..', '..', 'apps');
    const walker = walk(rootPath);
    walker.on('file', (directorypath, fileStats, next) => {
      observer.next(join(directorypath, fileStats.name).replace(`${rootPath}/`, ''));
      next();
    });
    walker.on('end', () => observer.complete());
  });

  getData(): Observable<SearchResult> {
    return this._file$.pipe(
      reduce((acc, fileName) => [...acc, fileName], []),
      map(fileNameList => {
        return {
          files: fileNameList.map(fileName => ({ fileName, matchCount: 0 }))
        };
      })
    );
  }
}
