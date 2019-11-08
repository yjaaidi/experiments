import { ServerModule } from '@angular/platform-server';
import { Component, NgModule, enableProdMode } from '@angular/core';

import "zone.js"
import { BrowserModule } from '@angular/platform-browser';
import { Data } from './data';

enableProdMode()

@Component({
  selector: "mc-hello",
  template: `
    <h1>Hello {{ data.title }}</h1>
  `,
})
export class HelloComponent {
  constructor(public data: Data) {
  }
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: "marmicode" }),
    ServerModule,
  ],
  bootstrap: [HelloComponent]
})
export class HelloModule {}