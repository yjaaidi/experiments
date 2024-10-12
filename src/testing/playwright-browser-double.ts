/* The moment we import TestBed in Playwright, it seems that we need the compiler which I find pretty surprising...
 * Error example: The injectable 'PlatformNavigation' needs to be compiled using the JIT compiler, but '@angular/compiler' is not available. */
import '@angular/compiler';
import type { PlaywrightTestArgs, PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions, TestType } from '@playwright/test';

export const test = ((
  name: string,
  testFn: TestFn) => {
  (globalThis as any)._testBearTests ??= {};
  (globalThis as any)._testBearTests[name] = testFn;
}) as TestType<PlaywrightTestArgs & PlaywrightTestOptions, PlaywrightWorkerArgs & PlaywrightWorkerOptions>;
(test as any).beforeEach = () => {};
(test as any).extend = () => test;

export function expect(...args: unknown[]): any {
  throw new Error('Move expect() in a `step` function');
}


type TestFn = (...args: any[]) => Promise<void>;