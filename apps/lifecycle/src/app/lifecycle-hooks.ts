import {
  inject,
  InjectFlags,
  InjectionToken,
  SimpleChange,
  SimpleChanges,
  Type,
} from '@angular/core';
import { map, Observable, Subject, filter } from 'rxjs';

export function LinkLifecycleHooks<T>() {
  return function (componentType: IvyComponentType<T>) {
    if (!componentType.ɵfac) {
      throw new Error(
        `${componentType.name} is either not a component or not compiled.`
      );
    }

    /**
     * Override component factory.
     */
    const factory = _decorate(
      componentType.ɵfac,
      /*
       * Override getters & setters.
       */
      (factoryFn: () => T) => () => {
        const component = factoryFn();

        _lifecycleHooksMap.set(
          component,
          inject(LifecycleHooksImpl, InjectFlags.Self) as LifecycleHooksImpl
        );

        return component;
      }
    );

    /**
     * Override factory with the newly decorated one.
     */
    Object.defineProperty(componentType, 'ɵfac', {
      get() {
        return factory;
      },
    });

    /**
     * Link hooks.
     */
    _spyOnMethod(componentType, 'ngOnInit', (instance) => {
      _getLifecycleHooksImpl(instance).init$.next();
    });
    _spyOnMethod(componentType, 'ngOnChanges', (instance, args) => {
      _getLifecycleHooksImpl(instance).changes$.next(
        args?.[0] as SimpleChanges
      );
    });
    _spyOnMethod(componentType, 'ngOnDestroy', (instance) => {
      const onDestroy$ = _getLifecycleHooksImpl(instance).destroy$;
      onDestroy$.next();
      onDestroy$.complete();
    });
    // @todo Add ngDoCheck and ngAfter* etc... sorry for being lazy...
  };
}

export interface LifecycleHooks {
  init$: Observable<void>;
  changes$: Observable<SimpleChanges>;
  destroy$: Observable<void>;
}
export function provideLifecycleHooks() {
  return [
    LifecycleHooksImpl,
    {
      provide: _LIFECYCLE_HOOKS_TOKEN,
      useExisting: LifecycleHooksImpl,
    },
  ];
}

export function injectLifecycleHooks(): LifecycleHooks {
  return inject(_LIFECYCLE_HOOKS_TOKEN, InjectFlags.Self) as LifecycleHooks;
}

export function getInputChange(
  hooks: LifecycleHooks,
  inputName: string
): Observable<SimpleChange> {
  return hooks.changes$.pipe(
    map((changes) => changes[inputName]),
    filter((change) => change != null)
  );
}

export interface IvyComponentType<T> extends Type<T> {
  ɵfac?: () => T;
}

const _lifecycleHooksMap = new WeakMap<any, LifecycleHooksImpl>();

function _getLifecycleHooksImpl(instance: any): LifecycleHooksImpl {
  const hooks = _lifecycleHooksMap.get(instance);
  if (hooks == null) {
    throw new Error(
      'No lifecycle hooks found for instance. Try adding @LinkLifecycleHooks() decorator and provideLifecycleHooks() to the providers.'
    );
  }
  return hooks;
}

class LifecycleHooksImpl implements LifecycleHooks {
  init$ = new Subject<void>();
  changes$ = new Subject<SimpleChanges>();
  destroy$ = new Subject<void>();

  constructor() {
    this.destroy$.subscribe(() => {
      this.init$.complete();
      this.changes$.complete();
    });
  }
}

const _LIFECYCLE_HOOKS_TOKEN = new InjectionToken<LifecycleHooks>(
  'lifecycle-hooks'
);

function _decorate<F extends (...args: unknown[]) => unknown>(
  fn: F,
  decorator: (fn: F) => F
) {
  return decorator(fn);
}

function _spyOnMethod<T>(
  klass: Type<T>,
  methodName: string,
  callback: (instance: T, args?: unknown[]) => void
) {
  const proto = klass.prototype;
  proto[methodName] = _decorate(
    proto[methodName],
    (wrappedMethod: (...args: unknown[]) => void) => {
      return function (this: T, ...args: unknown[]) {
        callback(this, args);
        return wrappedMethod?.bind(this)?.(...args);
      };
    }
  );
}
