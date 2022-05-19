import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectState } from './inject-state';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-counter',
  template: `<div>{{ state.counter }}</div>
    <div>
      <button (click)="state.counter = 0">RESET</button>
      <button (click)="increment()">+</button>
    </div>`,
})
export class CounterComponent {
  state = injectState({
    counter: 0,
  });

  increment() {
    /* Adding a dirty setTimeout to show that reactivity works anyway. */
    setTimeout(() => {
      this.state.counter += 1;
    }, 500);
  }
}

@Component({
  standalone: true,
  selector: 'mc-root',
  imports: [CounterComponent],
  template: `<mc-counter></mc-counter>`,
})
export class AppComponent {}
