import { Injectable } from '@nestjs/common';
import { SearchResult } from '@demo/api-interfaces';
import { Observable, of } from 'rxjs';

@Injectable()
export class AppService {
  getData(): Observable<SearchResult> {
    return of({
      files: [
        {
          fileName: 'test',
          matchCount: 123
        }
      ]
    });
  }
}
