import {
  Component,
  Injectable,
} from 'https://unpkg.com/@angular/core@14.0.1/fesm2020/core.mjs';

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
