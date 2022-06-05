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

  return {
    provide() {
      return [ReactiveStore];
    },
    inject() {
      const state = inject(
        ReactiveStore,
        InjectFlags.Self | InjectFlags.Optional
      );
      if (state == null) {
        throw new Error(`Oups! It seems that you forgot to provide the state.
Try adding "provideXXX()" to your declarable's providers.`);
      }
      return state;
    },
  };
}
