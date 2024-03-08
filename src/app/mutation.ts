import { signal } from '@angular/core';

export function createMutation<T>(fn: (value: T) => Promise<void>): Mutator<T> {
  const mutations = signal<Mutation<T>[]>([]);

  const mutator = ((value: T) => {
    const mutationState = signal<{
      error?: unknown;
      pending: boolean;
      value: T;
    }>({ pending: true, value });
    const mutation = (() => mutationState().value) as Mutation<T>;
    mutations.update((_mutations) => [..._mutations, mutation]);

    mutation.cancel = () => {
      /* @todo unsubscribe if observable or trigger abort signal etc... */
      mutations.update((_mutations) =>
        _mutations.filter((m) => m !== mutation)
      );
    };

    mutation.retry = () => {
      if (mutationState().pending) {
        throw new Error('Mutation has already been finalized.');
      }
      action();
    };

    mutation.error = () => mutationState().error;
    mutation.pending = () => mutationState().pending;

    function action() {
      mutationState.set({ error: undefined, pending: true, value });
      fn(value)
        .then(() =>
          mutations.update((_mutations) =>
            _mutations.filter((m) => m !== mutation)
          )
        )
        .catch((error) => mutationState.set({ error, pending: false, value }));
    }

    action();
  }) as Mutator<T>;

  mutator.pending = () => mutations().some((mutation) => mutation.pending());
  mutator.mutations = mutations.asReadonly();

  return mutator;
}

interface Mutator<T> {
  (value: T): void;

  mutations(): Mutation<T>[];

  pending(): boolean;
}

export interface Mutation<T> {
  (): T;

  cancel(): void;

  retry(): void;

  pending(): boolean;

  error(): unknown;
}
