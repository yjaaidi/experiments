import { connect } from 'mongodb';
import { join } from 'path';
import { defer } from 'rxjs';
import {
  bufferCount,
  concatMap,
  filter,
  finalize,
  mapTo,
  scan,
  shareReplay,
  switchMap,
  takeWhile,
  tap
} from 'rxjs/operators';
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
    /* Index d.ts files only to reduce the indexed volume. */
    filter(filePath => filePath.endsWith('.d.ts')),
    concatMap(filePath => readLines(filePath)),
    bufferCount(1000),
    concatMap(lines => insertLines(lines).pipe(mapTo(lines.length))),
    scan((acc, count) => acc + count, 0),
    tap(count => console.log(`Indexed ${count} lines`)),
    /* Don't index too many lines, otherwise mongo is too slow
     * as we query using $where.
     * Querying using $text is not an option as it's too fast
     * even with the whole node_modules. */
    takeWhile(count => count < 50000),
    /* Close the connection to remove all pending listeners,
     * and let the process exit. */
    finalize(async () => (await mongoClient$.toPromise()).close())
  );
}

indexFiles(join(__dirname, '..', '..', 'node_modules')).subscribe();
