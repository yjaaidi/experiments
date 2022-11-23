import { afterEach } from 'vitest';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';
import { NoopZone } from './app/testing/noop-zone';

(globalThis as any).Zone = NoopZone;

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
