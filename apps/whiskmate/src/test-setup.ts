import '@analogjs/vitest-angular/setup-zone';
import '@testing-library/jest-dom/vitest';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';
import { afterEach, beforeEach } from 'vitest';

beforeEach(() => {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
});

afterEach(() => {
  getTestBed().resetTestEnvironment();
});
