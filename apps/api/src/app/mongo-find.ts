import { connect, FilterQuery, FindOneOptions, MongoClient } from 'mongodb';
import { defer, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

const mongoClient$ = defer(() => connect('mongodb://127.0.0.1:27017', {
  useUnifiedTopology: true
})).pipe(
  shareReplay({
    bufferSize: 1,
    refCount: true
  })
);

export function mongoFind<TSchema>({
  collection,
  query,
  options
}: {
  collection: string;
  query: FilterQuery<TSchema>;
  options?: FindOneOptions;
}) {
  return mongoClient$.pipe(
    switchMap(mongoClient => {
      return new Observable<TSchema>(observer => {
        /* Start the session. */
        const session = mongoClient.startSession();

        /* Make the query and get the cursor. */
        const db = mongoClient.db('demo');

        const cursor = db.collection(collection).find(query, {
          ...options,
          session
        });

        /* Loop through the cursor and emit values. */
        async function emit() {
          while (await cursor.hasNext()) {
            const value = await cursor.next();
            observer.next(value);
          }
          observer.complete();
        }

        emit().catch(err => observer.error(err));

        /* Interrupt session on tear down. */
        return () => {
          /* session.endSession() is not violent enough. */
          db.admin().command({ killSessions: [session.id] });
        };
      });
    })
  );
}
