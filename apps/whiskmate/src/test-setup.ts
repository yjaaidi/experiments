import '@testing-library/jest-dom';
import 'reflect-metadata';
import { getTestBed, TestBed } from '@angular/core/testing';

import './styles.css';

// @hack load file otherwise it is not compiled as we are using an alias.
import '../vitest-bridge';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { beforeEach } from 'vitest';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideExperimentalZonelessChangeDetection()],
  });
});
