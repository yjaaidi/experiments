import { effect, signal, Signal } from '@angular/core';

export function throttleSignal<T>(
  source: Signal<T>,
  { duration = 1000 }: { duration?: number } = {}
): Signal<T> {
  const debounced = signal<T>(source() as T);
  const lastEmitted = Date.now();

  effect(() => {
    const value = source() as T;
    const remainingTime = Math.max(0, duration - (Date.now() - lastEmitted));

    return remainingTime > 0
      ? schedule(() => debounced.set(value), remainingTime)
      : debounced.set(value);
  });

  return debounced;
}

export function schedule(task: () => void, delay: number) {
  const timeout = setTimeout(task);
  return () => clearTimeout(timeout);
}
