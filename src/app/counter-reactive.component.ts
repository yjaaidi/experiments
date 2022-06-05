import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { describeReactiveStore } from './reactive-store-proxy';

const { provide: provideCounterStore, inject: injectCounterStore } =
  describeReactiveStore({
    counter: 0,
  });

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-counter-reactive',
  imports: [CommonModule],
  template: `<div>
    <div>{{ store.counter }}</div>
    <button (click)="increment()">+</button>
  </div>`,
  providers: [provideCounterStore()], // remove this and you get an error even if it's provided by the parent.
})
export class CounterReactiveComponent {
  store = injectCounterStore();

  increment() {
    /* Adding some delay to make sure CD works. */
    setTimeout(() => ++this.store.counter, 10);
  }
}
