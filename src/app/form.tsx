import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  concatMap,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
} from 'rxjs';
import { useDebounce, useObservable } from './use-control';
import styles from './form.module.css';

export function Form() {
  const [updateName, { pending: pendingName }] =
    useQueuedMutation('updateEmail');
  const [updateEmail, { pending: pendingEmail }] =
    useQueuedMutation('updateName');
  const nameEl = useRef<HTMLInputElement>(null);
  const nameControl = useDebounce<string>({
    onChange: (name) => updateName(name),
  });
  const emailControl = useDebounce<string>({
    onChange: (email) => updateEmail(email),
  });

  return (
    <>
      <input
        ref={nameEl}
        placeholder="name"
        disabled={pendingName}
        onBlur={() => nameControl.commit()}
        onInput={(event) => nameControl.setValue(event.currentTarget.value)}
      />
      <input
        placeholder="email"
        disabled={pendingEmail}
        onBlur={() => emailControl.commit()}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            nameEl.current?.focus();
          }
        }}
        onInput={(event) => emailControl.setValue(event.currentTarget.value)}
      />
      <ul>
        <li>Name: {nameControl.value}</li>
        <li>Email: {emailControl.value}</li>
      </ul>
      {useIsPending() && <div className={styles.loadingbar} />}
    </>
  );
}

const ActionQueueContext = createContext<ActionQueue | undefined>(undefined);

interface ActionQueue {
  enqueue(mutation: Action): void;

  pending: boolean;
}

type Action = () => Promise<unknown>;

export function WithMutationQueue({ children }: { children: React.ReactNode }) {
  const { current: action$ } = useRef(new Subject<Action>());
  const enqueue = useCallback((action: Action) => action$.next(action), []);
  const pending = useObservable(() =>
    action$.pipe(
      concatMap((action) => {
        return new Observable<{ pending: boolean }>((observer) => {
          observer.next({ pending: true });
          action().then(() => {
            observer.next({ pending: false });
            observer.complete();
          });
        });
      }),
      map(({ pending }) => pending),
      distinctUntilChanged()
    )
  );

  return (
    <ActionQueueContext.Provider value={{ enqueue, pending: pending ?? false }}>
      {children}
    </ActionQueueContext.Provider>
  );
}

function useIsPending() {
  const actionQueue = useContext(ActionQueueContext);
  if (!actionQueue) {
    throw new Error('useIsPending must be used within a WithMutationQueue');
  }

  return actionQueue.pending;
}

function useQueuedMutation(
  ...args: Parameters<typeof useFakeMutation>
): ReturnType<typeof useFakeMutation> {
  const actionQueue = useContext(ActionQueueContext);
  if (!actionQueue) {
    throw new Error(
      'useQueuedMutation must be used within a WithMutationQueue'
    );
  }

  const [mutation, state] = useFakeMutation(...args);

  const enqueue = useCallback<typeof mutation>((...mutationArgs) => {
    return new Promise((resolve, reject) => {
      actionQueue.enqueue(() =>
        mutation(...mutationArgs)
          .then(resolve)
          .catch(reject)
      );
    });
  }, []);

  return [enqueue, state];
}

function useFakeMutation(
  query: string,
  {
    onCompleted,
    onError,
  }: {
    onCompleted?: (data: { myResult: string }) => void;
    onError?: (error: unknown) => void;
  } = {}
) {
  const [pending, setPending] = useState<boolean>(false);
  const [value, setValue] = useState<{ myResult: string } | undefined>(
    undefined
  );
  const [error, setError] = useState<unknown>(null);
  const mutation = useCallback(async (params: string) => {
    try {
      console.log(query, 'mutation started');
      setPending(true);
      const data = { myResult: `${query} result` };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (params.includes('error')) {
        throw new Error('error');
      }
      console.log(query, 'mutation completed');
      onCompleted?.(data);
      setValue(data);
    } catch (error) {
      setError(error);
      onError?.(error);
    } finally {
      setPending(false);
    }
  }, []);

  return [mutation, { value, pending, error }] as const;
}
