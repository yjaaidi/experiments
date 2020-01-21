import { Line, SearchResult } from '@demo/api-interfaces';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { bufferTime, map, take } from 'rxjs/operators';
import { escapeRegExp } from 'tslint/lib/utils';
import { mongoFind } from './mongo-find';

@Injectable()
export class FileSearchMongo {
  search(keywords: string): Observable<SearchResult> {
    return mongoFind<Line>({
      collection: 'lines',
      query: {
        content: {
          $regex: `${escapeRegExp(keywords)}`
        }
        // $where: `function() {
        //         return this.content.includes('${keywords.replace(/\\'/, '')}')
        //       }`
      },
      options: {
        batchSize: 1,
        sort: {
          content: 1
        },
        explain: true
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
