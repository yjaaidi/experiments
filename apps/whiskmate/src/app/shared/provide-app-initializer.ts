import { Observable } from 'rxjs';
import {
  APP_INITIALIZER,
  inject,
  Injector,
  Provider,
  runInInjectionContext,
} from '@angular/core';

export function provideAppInitializer(
  initializer: () => Observable<unknown> | Promise<unknown> | void
): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory() {
      const injector = inject(Injector);
      return () => runInInjectionContext(injector, initializer);
    },
  };
}
