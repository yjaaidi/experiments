/* The moment we import TestBed in Playwright, it seems that we need the compiler which I find pretty surprising...
 * Error example: The injectable 'PlatformNavigation' needs to be compiled using the JIT compiler, but '@angular/compiler' is not available. */
import '@angular/compiler';

export function test(
  name: string,
  testFn: (...args: any[]) => Promise<void>,
): void {
  // TODO store the testFn somewhere
}

export function expect(...args: unknown[]): any {
  throw new Error('Move expect() in a `step` function');
}
