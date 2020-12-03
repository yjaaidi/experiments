import { BrowserModule } from '@angular/platform-browser';
import { bootstrapModule, createComponent, createModule } from './ngx-light';
import { ReactiveComponentModule } from '@ngrx/component';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

module.hot && module.hot.accept();

const Demo = createComponent({
  selector: 'mc-demo',
  styles: [`:host { display: block; text-align: center; }`],
  template: `
      <img [src]="pictureUrl">
      <div>{{ now$ | ngrxPush | date:'HH:mm:ss' }}</div>
    `,
  component: class {
    pictureUrl = 'https://marmicode.io/f3683922cdecc8b0642e4ab8f8f1d35e.gif';
    now$ = timer(0, 1000).pipe(map(() => new Date()));
  },
});

const App = createComponent({
  selector: 'mc-app',
  template: `<mc-demo></mc-demo>`,
});

const AppModule = createModule({
  bootstrap: [App],
  declarations: [App, Demo],
  imports: [BrowserModule, ReactiveComponentModule],
});

bootstrapModule(AppModule);
