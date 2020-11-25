import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Inject,
  Injector,
  ModuleWithProviders,
  NgModule,
  Type,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'zone.js/dist/zone';

export async function mount(
  component,
  { imports }: { imports: Array<Type<any> | ModuleWithProviders<{}> | any[]> }
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const style = require('!!css-loader!../../../demo/src/styles.css').default.toString();
  // eslint-disable-next-line cypress/no-assigning-return-values
  const doc = cy['state']('document');

  _clearDoc(doc);
  _addStyle(doc, style);
  /* Create a container */
  const containerEl = _addContainer(doc);

  @NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, ...imports],
  })
  class CypressModule {
    constructor(@Inject(Injector) private _injector: Injector) {}

    ngDoBootstrap() {
      const appRef = this._injector.get(ApplicationRef);
      const resolver = this._injector.get(ComponentFactoryResolver);

      /* Insert the component. */
      const componentRef = resolver
        .resolveComponentFactory(component)
        .create(this._injector, [], containerEl);

      /* This is necessary for change detection! */
      appRef.attachView(componentRef.hostView);
    }
  }

  await platformBrowserDynamic([
    {
      provide: DOCUMENT,
      useValue: doc,
    },
  ]).bootstrapModule(CypressModule);
}

function _clearDoc(doc: Document) {
  doc.head.innerHTML = '';
  doc.body.innerHTML = '';
}

function _addStyle(doc: Document, style: string) {
  const styleEl = doc.createElement('style');
  styleEl.textContent = style;
  doc.body.append(styleEl);
}

function _addContainer(doc: Document) {
  const containerEl = doc.createElement('div');
  doc.body.append(containerEl);
  return containerEl;
}
