import { CounterReactiveComponent } from './counter-reactive.component';
import { CounterComponent } from './counter.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { describeReactiveStore } from './reactive-store-factory';
import { injectStore, provideStore } from './store';

@Component({
  standalone: true,
  selector: 'mc-root',
  imports: [CounterComponent, CounterReactiveComponent],
  template: `<mc-counter></mc-counter
    ><mc-counter-reactive></mc-counter-reactive>`,
  providers: [provideStore()],
})
export class AppComponent {}
