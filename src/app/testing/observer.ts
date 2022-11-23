import { Observable, Observer, Subscription } from 'rxjs';
import { Mocked, beforeEach, afterEach, vi } from 'vitest';

export function createObserver() {
  let subscription: Subscription;

  beforeEach(() => {
    subscription = new Subscription();
  });
  afterEach(() => subscription.unsubscribe());

  return {
    observe<T>(observable: Observable<T>) {
      const observer: Mocked<Observer<T>> = {
        next: vi.fn<[T], void>(),
        error: vi.fn<[unknown], void>(),
        complete: vi.fn<[], void>(),
      };
      subscription.add(observable.subscribe(observer));
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
