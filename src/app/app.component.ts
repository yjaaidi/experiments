import { Component } from '@angular/core';
import { CounterComponent } from './counter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CounterComponent],
  template: `<mc-counter/>`,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        font-size: 2em;
      }
    `,
  ],
})
export class AppComponent {}
