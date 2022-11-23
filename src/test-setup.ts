import { afterEach } from 'vitest';

/* @hack use a dummy zone implementation because Angular TestBed
 * manually instantiates NgZone.
 * This could be quickly fixed. */
class NoopZone {
  static root = new NoopZone();
  static current = NoopZone.root;
  static currentTask = null;

  static assertZonePatched() {
    return true;
  }

  static __load_patch() {}

  static __symbol__(name: string) {
    return name;
  }

  fork() {
    return this;
  }

  run(callback: Function, applyThis?: any, applyArgs?: any[]) {
    return callback.apply(applyThis, applyArgs);
  }
}
(globalThis as any).Zone = NoopZone;

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

/* Angular's TestBed automatic tear down doesn't work because Angular can't hook into vitest tear down.
 * It probably can't find `afterEach` in the globals.
 * We could set `globalThis.afterEach` manually but this causes surprising zone.js issues.
 * e.g. zone-testing.js is needed for the fakeAsync() test helper but could not be found. */
afterEach(() => {
  getTestBed().resetTestingModule();
});
