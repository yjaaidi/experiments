import '@analogjs/vite-plugin-angular/setup-vitest';
import '@testing-library/jest-dom';
import 'reflect-metadata';
import { getTestBed } from '@angular/core/testing';

import './styles.css';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
