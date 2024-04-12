import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  first,
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
  const dirtyValue$ = useMemo(() => new Subject<T>(), []);
  const commit$ = useMemo(() => new Subject<void>(), []);

  const value = useObservable(() => {
    return dirtyValue$.pipe(
      /* Wait either for a commit or a delay whichever comes first. */
      switchMap((value) =>
        merge(commit$, timer(delay)).pipe(
          first(),
          map(() => value)
        )
      ),
      tap((value) => onChange?.(value))
    );
  });

  return {
    value,
    commit() {
      commit$.next();
    },
    setValue(value: T) {
      dirtyValue$.next(value);
    },
  };
}

export function useObservable<T>(sourceFn: () => Observable<T>): T | undefined {
  const [value, setValue] = useState<T | undefined>();
  useEffect(() => {
    const subscription = sourceFn().subscribe((_value) => {
      setValue(_value);
    });
    return () => subscription.unsubscribe();
  }, []);

  const valueRef = useRef<T | undefined>(undefined);
  const subscribe = useCallback((onChange: () => void) => {
    const subscription = sourceFn().subscribe((_value) => {
      valueRef.current = _value;
      onChange();
    });
    return () => subscription.unsubscribe();
  }, []);

  return value;
}
