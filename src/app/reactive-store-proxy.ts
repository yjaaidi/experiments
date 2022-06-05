import {
  ChangeDetectorRef,
  inject,
  Injectable,
  InjectFlags,
  InjectionToken,
} from '@angular/core';
import { RxState } from '@rx-angular/state';

export function describeReactiveStore<STATE extends Record<string, unknown>>(
  initialState: Partial<STATE>
) {
  @Injectable()
  class ReactiveStore extends RxState<STATE> {
    constructor(cdr: ChangeDetectorRef) {
      super();

      /* Initialize state. */
      this.set(initialState);

      /* Trigger change detection on state change. */
      this.hold(this.select(), () => cdr.markForCheck());
    }
  }

  const token = new InjectionToken<ReactiveStore & STATE>('ReactiveStore');

  return {
    provide() {
      return [
        ReactiveStore,
        {
          provide: token,
          useFactory() {
            const store = inject(ReactiveStore);
            return new Proxy(store, {
              get(target: any, prop) {
                return target.get(prop);
              },
              set(target: any, prop, value) {
                target.set({ [prop]: value });
                return true;
              },
            });
          },
        },
      ];
    },
    inject() {
      const state = inject(token, InjectFlags.Self | InjectFlags.Optional);
      if (state == null) {
        throw new Error(`Oups! It seems that you forgot to provide the state.
Try adding "provideXXX()" to your declarable's providers.`);
      }
      return state;
    },
  };
}
