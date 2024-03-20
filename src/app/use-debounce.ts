import { useCallback, useRef, useSyncExternalStore } from 'react';
import {
  distinctUntilChanged,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  tap,
  timer,
} from 'rxjs';

export function useDebounce<T>({
  delay = 1000,
  onChange,
}: { delay?: number; onChange?: (value: T) => void } = {}) {
  const subjectRef = useRef(new Subject<T>());
  const commitSubjectRef = useRef(new Subject<void>());

  const value = useObservable(() => {
    const commit$ = commitSubjectRef.current;
    const value$ = subjectRef.current;
    return value$.pipe(
      /* Wait either for a commit or a delay whichever comes first. */
      switchMap((value) => merge(commit$, timer(delay)).pipe(map(() => value))),
      distinctUntilChanged(),
      tap((value) => onChange?.(value))
    );
  });

  return {
    value,
    commit() {
      commitSubjectRef.current.next();
    },
    setValue(value: T) {
      subjectRef.current.next(value);
    },
  };
}

function useObservable<T>(sourceFn: () => Observable<T>): T | undefined {
  const valueRef = useRef<T | undefined>(undefined);
  const subscribe = useCallback((onChange: () => void) => {
    const subscription = sourceFn().subscribe((_value) => {
      valueRef.current = _value;
      onChange();
    });
    return () => subscription.unsubscribe();
  }, []);

  return useSyncExternalStore(subscribe, () => valueRef.current);
}