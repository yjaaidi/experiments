import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Inject,
  Injector,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '../../../demo/src/polyfills'; // zone etc...
import { AppModule } from './../../../demo/src/app/app.module';
import { DemoComponent } from './../../../demo/src/app/demo.component';

@NgModule({
  imports: [AppModule],
})
export class CypressModule {
  constructor(@Inject(Injector) private _injector: Injector) {}

  ngDoBootstrap() {
    const appRef = this._injector.get(ApplicationRef);
    const resolver = this._injector.get(ComponentFactoryResolver);
    const doc = this._injector.get(DOCUMENT);
    const containerEl = doc.createElement('mc-demo');
    const styleEl = doc.createElement('style');
    styleEl.textContent = require('!!css-loader!../../../demo/src/styles.css').default.toString();
    doc.head.innerHTML = '';
    doc.body.innerHTML = '';
    doc.body.append(styleEl, containerEl);
    const componentRef = resolver
      .resolveComponentFactory(DemoComponent)
      .create(this._injector, [], containerEl);
    appRef.attachView(componentRef.hostView);
  }
}

export function mount() {
  // eslint-disable-next-line cypress/no-assigning-return-values
  platformBrowserDynamic([
    {
      provide: DOCUMENT,
      useValue: cy['state']('document'),
    },
  ]).bootstrapModule(CypressModule);
}
