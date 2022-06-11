import { Component, Injectable } from '@angular/core';

export function defineComponent(componentDef) {
  const { component = class {}, ...rest } = componentDef;
  return Component({
    standalone: true,
    ...rest,
  })(component);
}

export function defineInjectable(injectable, options) {
  return Injectable(options)(injectable);
}
