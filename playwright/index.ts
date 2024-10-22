import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
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

TestBed.configureTestingModule({
  providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
});

globalThis.pwMount = async (cmpType: Type<unknown>) => {
  TestBed.createComponent(cmpType);
};

// @ts-ignore
import('./generated/tests');
