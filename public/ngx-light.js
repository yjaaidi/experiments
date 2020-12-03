import { Component, NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export function bootstrapModule(module) {
  return platformBrowserDynamic().bootstrapModule(module, {
    ngZone: 'noop',
  });
}

export function createComponent(componentDef) {
  const { component = class {}, ...rest } = componentDef;
  Component({
    ...rest,
  })(component);
  return component;
}

export function createModule(moduleDef) {
  const module = class {};
  NgModule(moduleDef)(module);
  return module;
}
