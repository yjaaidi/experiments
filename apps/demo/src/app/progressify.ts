import { of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

export function progressify<T>(): OperatorFunction<T, Progressified<T>> {
  return pipe(
    map(data => ({ data, isLoading: false })),
    startWith({ isLoading: true }),
    catchError(error => of({ isLoading: false, error }))
  );
}

export interface Progressified<T> {
  data?: T;
  error?: unknown;
  isLoading: boolean;
}
