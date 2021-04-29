import { join } from 'path';
import { bindNodeCallback, defer, Observable } from 'rxjs';
import {
  concatMap,
  mergeMap,
  scan,
  shareReplay,
  switchMap,
  tap,
  bufferCount,
  mapTo
} from 'rxjs/operators';
import { connect, MongoClient } from 'mongodb';
import { Line } from '../../libs/api-interfaces/src/lib/api-interfaces';
import { getFiles, readLines } from '../../libs/walker/src/lib/walker';

const mongoClient$ = defer(() => connect('mongodb://127.0.0.1:27017')).pipe(
  shareReplay({
    bufferSize: 1,
    refCount: true
  })
);

export function insertLines(lines: Line[]) {
  return mongoClient$.pipe(
    switchMap(client => {
      return defer(() =>
        client
          .db('demo')
          .collection('lines')
          .insertMany(lines)
      );
    })
  );
}

export function indexFiles(path: string) {
  return getFiles(path).pipe(
    concatMap(filePath => readLines(filePath)),
    bufferCount(1000),
    concatMap(lines => insertLines(lines).pipe(mapTo(lines.length))),
    scan((acc, count) => acc + count, 0),
    tap(count => console.log(`Indexed ${count} lines`))
  );
}

indexFiles(join(__dirname, '..', '..', 'node_modules')).subscribe();
