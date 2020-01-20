import { join } from 'path';
import { bindNodeCallback, defer, Observable } from 'rxjs';
import { concatMap, mergeMap, scan, shareReplay, switchMap, tap } from 'rxjs/operators';
import { connect, MongoClient } from 'mongodb';
import { Line } from '../../libs/api-interfaces/src/lib/api-interfaces';
import { getFiles, readLines } from '../../libs/walker/src/lib/walker';

const mongoClient$ = defer(() => connect('mongodb://127.0.0.1:27017')).pipe(
  shareReplay({
    bufferSize: 1,
    refCount: true
  })
);


export function insertLine(line: Line) {
  return mongoClient$.pipe(
    switchMap(client => {
      return defer(() =>
        client
          .db('demo')
          .collection('lines')
          .insertOne(line)
      );
    })
  );
}

export function indexFiles(path: string) {
  return getFiles(path).pipe(
    concatMap(filePath => readLines(filePath)),
    concatMap(line => insertLine(line)),
    scan((acc, _: any) => acc + 1, 0),
    tap(count => {
      if (count % 100 === 0) {
        console.log(`Indexed ${count} lines`)
      }
    })
  );
}

indexFiles(join(__dirname, '..', '..', 'node_modules')).subscribe();
