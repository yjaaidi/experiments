import { Line, SearchResult } from '@demo/api-interfaces';
import { getFiles, readLines } from '@demo/walker';
import { Injectable } from '@nestjs/common';
import { connect, Cursor, MongoClient } from 'mongodb';
import { join } from 'path';
import { defer, Observable, of } from 'rxjs';
import {
  bufferTime,
  filter,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  take
} from 'rxjs/operators';
import { escapeRegExp } from 'tslint/lib/utils';

const mongoClient$ = defer(() => connect('mongodb://127.0.0.1:27017')).pipe(
  shareReplay({
    bufferSize: 1,
    refCount: true
  })
);

export function cursorToObservable<T>(cursor: Cursor<T>): Observable<T> {
  return new Observable<T>(observer => {

    async function emit() {
      while (await cursor.hasNext()) {
        observer.next(await cursor.next());
      }
      observer.complete();
    }

    emit().catch(err => observer.error());

  });
}

@Injectable()
export class FileSearchMongo {
  search(keywords: string): Observable<SearchResult> {

    console.log({
      content: {
        $regex: `${escapeRegExp(keywords)}`
      }
    });

    return mongoClient$.pipe(
      switchMap(mongoClient => {
        const cursor = mongoClient
          .db('demo')
          .collection('lines')
          .find({
            content: {
              $regex: `${escapeRegExp(keywords)}`
            }
          });

        return cursorToObservable<Line>(cursor);
      }),
      bufferTime(5000),
      take(1),
      map(lines => ({
        items: lines
      }))
    );
  }
}
