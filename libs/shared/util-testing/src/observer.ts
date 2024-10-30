import { Observable, Observer, Subscription } from 'rxjs';
import { type Mocked, vi } from 'vitest';
import { OutputRef } from '@angular/core';

export function createObserver() {
  let subscription: Subscription;

  beforeEach(() => (subscription = new Subscription()));
  afterEach(() => subscription.unsubscribe());

  return {
    observe<T>(observable: Observable<T> | OutputRef<T>) {
      const observer: Mocked<Observer<T>> = {
        next: vi.fn<[T], void>(),
        error: vi.fn<[unknown], void>(),
        complete: vi.fn<[], void>(),
      };
      if (isObservable(observable)) {
        subscription.add(observable.subscribe(observer));
      } else {
        subscription.add(observable.subscribe(observer.next));
      }
      return {
        ...observer,
        mockClear() {
          observer.next.mockClear();
          observer.error.mockClear();
          observer.complete.mockClear();
        },
        mockReset() {
          observer.next.mockReset();
          observer.error.mockReset();
          observer.complete.mockReset();
        },
      };
    },
  };
}

function isObservable<T>(
  observable: Observable<T> | OutputRef<T>,
): observable is Observable<T> {
  return !('destroyRef' in observable);
}
