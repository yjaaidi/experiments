import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { defineComponent, defineInjectable } from './ngx-light.mjs';
import { timer, map } from 'rxjs';

// @todo switch to decorators the days ES decorators land
// https://github.com/tc39/proposal-decorators

const NowService = defineInjectable(
  class {
    now$ = timer(0, 100).pipe(map(() => new Date()));
  },
  { providedIn: 'root' }
);

const Counter = defineComponent({
  selector: 'mc-counter',
  template: `
    <div>{{count}}</div>
    <button [disabled]="count === 0" (click)="count = count - 1">-</button>
    <button (click)="count = count + 1">+</button>
  `,
  component: class {
    count = 0;
  },
});

const Demo = defineComponent({
  selector: 'mc-demo',
  imports: [CommonModule],
  template: `
    <img [src]="pictureUrl">
    <div>{{ now$ | async | date:'HH:mm:ss' }}</div>
  `,
  component: class {
    pictureUrl = 'https://marmicode.io/f3683922cdecc8b0642e4ab8f8f1d35e.gif';
    now$ = inject(NowService).now$;
  },
});

const App = defineComponent({
  selector: 'mc-app',
  imports: [Counter, Demo],
  template: `<mc-demo></mc-demo><mc-counter></mc-counter>`,
  styles: [`:host {display: block; text-align: center; }`],
});

bootstrapApplication(App);
