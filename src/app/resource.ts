import { Observable } from 'rxjs';
import { DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export function createResource<T>(fn: () => Observable<T>): Resource<T> {
  const destroyRef = inject(DestroyRef);
  const state = signal<Suspense<T>>({
    status: 'pending'
  });

  function action() {
    return fn()
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (value) => state.set({ status: 'success', value }),
        error: (error) => state.set({ status: 'error', error })
      });
  }

  effect(
    (onCleanUp) => {
      state.set({ status: 'pending' });
      const sub = action();
      onCleanUp(() => sub.unsubscribe());
    },
    { allowSignalWrites: true }
  );

  const resource = (() => {
    const suspense = state();
    if (suspense.status !== 'success' && suspense.status !== 'refetching') {
      throw new Error('Resource is not in success or refetching state.');
    }
    return suspense.value;
  }) as Resource<T>;

  Object.defineProperty(resource, 'canRefetch', {
    get() {
      const status = state().status;
      return status === 'success' || status === 'error';
    }
  });

  Object.defineProperty(resource, 'hasValue', {
    get() {
      const suspense = state();
      return (
        suspense.status === 'success' ||
        (suspense.status === 'refetching' && suspense.value !== undefined)
      );
    }
  });

  Object.defineProperty(resource, 'pending', {
    get() {
      const status = state().status;
      return status === 'pending' || status === 'refetching';
    }
  });

  Object.defineProperty(resource, 'status', {
    get() {
      return state().status;
    }
  });

  Object.defineProperty(resource, 'error', {
    get() {
      const suspense = state();
      if (suspense.status !== 'error') {
        throw new Error('Resource is not in error state.');
      }
      return suspense.error;
    }
  });

  resource.set = (value) => state.set({ status: 'success', value });
  (resource as { update(updater: (v: T | undefined) => T): void }).update = (
    updater
  ) =>
    state.update((suspense) => {
      return {
        status: 'success',
        value: updater('value' in suspense ? suspense.value : undefined)
      };
    });

  (resource as { refetch(): void }).refetch = () => {
    const suspense = untracked(state);

    if (suspense.status === 'pending' || suspense.status === 'refetching') {
      return;
    }

    state.set({
      status: 'refetching',
      value: 'value' in suspense ? suspense.value : undefined
    });

    action();
  };

  return resource;
}

type Resource<T> = ResourceBase<T> &
  (
    | {
    status: 'fetching';
    canRefetch: false;
    hasValue: false;
    pending: true;
  }
    | {
    status: 'success';
    canRefetch: true;
    hasValue: true;
    pending: false;
    (): T;
    refetch(): void;
    update: (updater: (value: T) => T) => void;
  }
    | {
    status: 'error';
    canRefetch: true;
    hasValue: false;
    pending: false;
    error: unknown;
    refetch(): void;
  }
    | {
    status: 'refetching';
    canRefetch: false;
    hasValue: false;
    pending: true;
    (): undefined;
    update: (updater: () => T) => void;
  }
    | {
    status: 'refetching';
    canRefetch: false;
    hasValue: true;
    pending: true;
    (): T;
    update: (updater: (value: T) => T) => void;
  }
    );

interface ResourceBase<T> {
  set: (value: T) => void;
}

type Suspense<T> =
  | { status: 'pending' }
  | { status: 'success'; value: T }
  | { status: 'error'; error: unknown }
  | { status: 'refetching'; value: T | undefined };
