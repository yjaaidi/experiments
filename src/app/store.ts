import { inject, InjectFlags } from '@angular/core';
export interface Store {
  // @todo
}

class StoreImpl implements Store {
  // @todo
}

export function provideStore() {
  return [StoreImpl];
}

export function injectStore() {
  const store = inject(StoreImpl, InjectFlags.Self | InjectFlags.Optional);

  if (store == null) {
    throw new Error(`☹️ Oups! It seems that you forgot to provide a private store.
    Try adding "provideStore()" to your declarable's providers.
    Cf. LINK_TO_DOCS_HERE`);
  }

  return store;
}