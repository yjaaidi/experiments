import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectStore, provideStore } from './store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-counter',
  imports: [CommonModule],
  template: `🚧 &lt;mc-counter&gt;`,
  providers: [provideStore()], // remove this and you get an error even if it's provided by the parent.
})
export class CounterComponent {
  store = injectStore();
}
