import { join } from 'path';
import { bindNodeCallback, defer, Observable } from 'rxjs';
import { mergeMap, scan, switchMap, tap } from 'rxjs/operators';
import { connect, MongoClient } from 'mongodb';
import { Line } from '../../libs/api-interfaces/src/lib/api-interfaces';
import { getFiles, readLines } from '../../libs/walker/src/lib/walker';

export function getMongoClient(): Promise<MongoClient> {
  const uri = 'mongodb://127.0.0.1:27017';

  return connect(
    uri,
    {
      useUnifiedTopology: true
    }
  );
}

export function insertLine(line: Line) {
  return defer(() => getMongoClient()).pipe(
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

indexFiles(join(__dirname, '..', '..', 'node_modules')).subscribe();
