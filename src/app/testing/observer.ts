import { Observable, Observer, Subscription } from 'rxjs';
import { fn, Mocked } from 'jest-mock';

export function createObserver() {
  let subscription: Subscription;

  beforeEach(() => {
    subscription = new Subscription();
  });
  afterEach(() => subscription.unsubscribe());

  return {
    observe<T>(observable: Observable<T>) {
      const observer: Mocked<Observer<T>> = {
        next: fn(),
        error: fn(),
        complete: fn(),
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
