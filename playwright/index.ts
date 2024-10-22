import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { Type } from '@angular/core';

declare global {
  function pwMount(cmpType: Type<unknown>): Promise<void>;
}

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

globalThis.pwMount = async (cmpType: Type<unknown>) => {
  TestBed.createComponent(cmpType);
};

// @ts-ignore
import('./generated/tests');
