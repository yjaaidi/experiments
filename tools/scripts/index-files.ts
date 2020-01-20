import { join } from 'path';
import { bindNodeCallback, defer, Observable } from 'rxjs';
import { mergeMap, scan, switchMap, tap } from 'rxjs/operators';
import { MongoClient } from 'mongodb';
import { Line } from '../../libs/api-interfaces/src/lib/api-interfaces';
import { getFiles, readLines } from '../../libs/walker/src/lib/walker';

export function getMongoClient(): Observable<MongoClient> {
  const url = 'mongodb://localhost:27017';

  return bindNodeCallback(MongoClient.connect)(url) as Observable<MongoClient>;
}

export function insertLine(line: Line) {
  return getMongoClient().pipe(
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
    mergeMap(filePath => readLines(filePath)),
    mergeMap(line => insertLine(line)),
    scan((acc, _: any) => acc + 1, 0),
    tap(count => console.log(`Indexed ${count} lines`))
  );
}

indexFiles(join(__dirname, '..', 'node_modules')).subscribe();
