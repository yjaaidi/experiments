import { Line, SearchResult } from '@demo/api-interfaces';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { bufferTime, map, take } from 'rxjs/operators';
import { mongoFind } from './mongo-find';

@Injectable()
export class FileSearchMongo {
  search(keywords: string): Observable<SearchResult> {
    return mongoFind<Line>({
      collection: 'lines',
      query: {
        /* @hack: Don't use this at home!!!
         * We're just trying to slow down the query as much as possible.
         * In addition to this, it's totally unsafe and can allow code injection. */
        $where: `function() {
          return this.content.includes('${keywords.replace(
            /(['\\])/g,
            '\\$1'
          )}')
        }`
      }
    }).pipe(
      bufferTime(5000),
      take(1),
      map(lines => ({
        items: lines
      }))
    );
  }
}
