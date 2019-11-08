import { Component, enableProdMode, NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { ServerModule } from "@angular/platform-server"
import { renderScam } from 'render-scam'
import "zone.js"
import { Data } from './data'

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

console.time();

renderScam(HelloModule, {
  title: 'Marmicode'
}).then(console.log);

console.timeEnd()
