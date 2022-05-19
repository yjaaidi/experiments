import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { RxState } from '@rx-angular/state';

export function injectState<STATE extends object>(initialState: STATE) {
  const viewRef = inject(ChangeDetectorRef) as ViewRef;

  /* Initialize state. */
  const state = new RxState<STATE>();
  state.set(initialState);

  /* Trigger change detection on state change. */
  state.hold(state.select(), () => viewRef.markForCheck());

  /* Unsubscribe from everything on destroy. */
  /* @hack queue microtask otherwise this breaks in devMode due
   * to the following condition: https://github.com/angular/angular/blob/0ff4eda3d4bd52fb145285a472e9c0237ea8e68f/packages/core/src/render3/instructions/shared.ts#L804-L806
   * Credits to Chau Tran for raising the issue.*/
  queueMicrotask(() => {
    viewRef.onDestroy(() => state.ngOnDestroy());
  });

  return new Proxy(state, {
    get(target, prop) {
      if (isKeyOf(prop, initialState)) {
        return target.get(prop);
      }
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      if (isKeyOf(prop, initialState)) {
        target.set({ [prop]: value } as any);
      } else {
        Reflect.set(target, prop, value);
      }
      return true;
    },
  }) as RxState<STATE> & STATE;
}

export function isKeyOf<T extends Object>(key: any, obj: T): key is keyof T {
  return typeof key === 'string' && Object.keys(obj).includes(key);
}
