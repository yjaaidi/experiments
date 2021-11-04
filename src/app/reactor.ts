import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Type,
  ɵɵdirectiveInject,
} from '@angular/core';
import {
  asapScheduler,
  BehaviorSubject,
  debounce,
  debounceTime,
  distinctUntilChanged,
  from,
  Observable,
  observeOn,
  tap,
  timer,
} from 'rxjs';
import { __decorate } from 'tslib';

export function Reactive() {
  return function ReactiveDecorator<T>(originalClass: Type<T>): Type<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyOriginalClass = originalClass as any;

    anyOriginalClass['ɵfac'] = __decorate(
      [
        (factoryFn: (...args: unknown[]) => Type<T>) =>
          (...args: unknown[]) => {
            const instance = factoryFn(...args);
            const cdr = ɵɵdirectiveInject(ChangeDetectorRef);
            cdr.detach();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (instance as any)[_cdrSymbol] = cdr;

            return instance;
          },
      ],
      anyOriginalClass['ɵfac']
    );

    const ReactiveProxyClass = function (this: T, ...args: unknown[]) {
      return Reflect.construct(originalClass, args, ReactiveProxyClass);
    };

    /* Copy static properties. */
    Object.assign(ReactiveProxyClass, originalClass);

    ReactiveProxyClass.prototype = new Proxy(originalClass.prototype, {
      set(target, property, value) {
        _getOrCreateSubject(target, property).next(value);
        return Reflect.set(target, property, value);
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ReactiveProxyClass as any;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
export function watch<T extends object>(
  instance: T,
  property: keyof T
): Observable<T[keyof T]> {
  return _getOrCreateSubject(instance, property).pipe(distinctUntilChanged());
}

// eslint-disable-next-line @typescript-eslint/ban-types
const _getOrCreateSubject = <T extends object>(
  instance: T,
  property: keyof T
): BehaviorSubject<T[keyof T]> => {
  const subjects = _getSubjects(instance);

  if (subjects[property] == null) {
    subjects[property] = new BehaviorSubject(instance[property]);

    /* Trigger change detection. */
    // @todo coalesce
    watch(instance, property)
      .pipe(observeOn(asapScheduler))
      .subscribe(() => _getCdr(instance)?.detectChanges());
  }

  return subjects[property];
};

/**
 * Get or create subjects record.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const _getSubjects = <T extends object>(
  instance: T
): Record<keyof T, BehaviorSubject<T[keyof T]>> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (instance as any)[_subjectsSymbol] ??
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((instance as any)[_subjectsSymbol] = {});

const _subjectsSymbol = Symbol('Subjects');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getCdr = (instance: any) => instance[_cdrSymbol];

const _cdrSymbol = Symbol('ChangeDetectorRef');
