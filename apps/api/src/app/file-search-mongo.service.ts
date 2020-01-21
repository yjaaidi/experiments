import { Line, SearchResult } from '@demo/api-interfaces';
import { getFiles, readLines } from '@demo/walker';
import { Injectable } from '@nestjs/common';
import { ClientSession, connect, Cursor, MongoClient } from 'mongodb';
import { join } from 'path';
import { defer, Observable, of } from 'rxjs';
import {
  bufferCount,
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

async function sleep(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export function mongoQueryToObservable<T>({
  cursor,
  session
}: {
  cursor: Cursor<T>;
  session: ClientSession;
}): Observable<T> {
  return new Observable<T>(observer => {
    let complete = false;

    async function emit() {
      while ((await cursor.hasNext()) && !complete) {
        const value = await cursor.next();
        observer.next(value);
      }
      observer.complete();
    }

    emit().catch(err => observer.error(err));

    return () => {
      complete = true;
      session.endSession();
      cursor.close();
    };
  });
}

@Injectable()
export class FileSearchMongo {
  search(keywords: string): Observable<SearchResult> {
    return mongoClient$.pipe(
      switchMap(mongoClient => {
        const session = mongoClient.startSession();

        const cursor = mongoClient
          .db('demo')
          .collection('lines')
          .find(
            {
              // content: {
              //   $regex: `${escapeRegExp(keywords)}`
              // }
              $where: `function() {
                return this.content.includes('${keywords.replace(/\\'/, '')}')
              }`
            },
            {
              session
            }
            // {
            //   batchSize: 1,
            //   sort: {
            //     content: 1
            //   }
            // }
          );

        return mongoQueryToObservable<Line>({ cursor, session });
      }),
      bufferTime(5000),
      take(1),
      map(lines => ({
        items: lines
      }))
    );
  }
}
