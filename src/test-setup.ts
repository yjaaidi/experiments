import './app/testing/noop-zone';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { octopus, Platform } from './app/testing/octopus';
import { render } from '@testing-library/angular';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

const testWrapper: Platform['test'] = (
  name: string,
  fn: () => Promise<void>
) => {
  return test(name, fn);
};

octopus.setPlatform({
  describe,
  it: testWrapper,
  test: testWrapper,
  async find(selector) {
    return document.querySelector(selector) as any;
  },
  async findAll(selector) {
    return document.querySelectorAll(selector) as any;
  },
  async mount(componentType, options) {
    await render(componentType, options);
  },
  expect: (value) => {
    return {
      toEqual: (expected) => {
        expect(value).toEqual(expected);
      },
    };
  },
});
