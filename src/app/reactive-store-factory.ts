import {
  ChangeDetectorRef,
  inject,
  InjectFlags,
  InjectionToken,
} from '@angular/core';
import { RxState } from '@rx-angular/state';

export function describeReactiveStore<STATE extends Record<string, unknown>>(
  initialState: Partial<STATE>
) {
  const privateStoreToken = new InjectionToken<RxState<STATE>>('PrivateState');
  return {
    provide() {
      return [
        RxState,
        {
          provide: privateStoreToken,
          useFactory() {
            const cdr = inject(ChangeDetectorRef);
            const store = inject(RxState);

            /* Initialize state. */
            store.set(initialState);

            /* Trigger change detection on state change. */
            store.hold(store.select(), () => cdr.markForCheck());

            return store;
          },
        },
      ];
    },
    inject() {
      const state = inject(
        privateStoreToken,
        InjectFlags.Self | InjectFlags.Optional
      );
      if (state == null) {
        throw new Error(`Oups! It seems that you forgot to provide the state.
Try adding "provideState()" to your declarable's providers.`);
      }
      return state;
    },
  };
}
