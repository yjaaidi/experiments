import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * @deprecated @wiprecated not ready yet.
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-counter',
  template: `🚧 mc-counter is not implemented yet 🚧`,
})
export class CounterComponent {
  @Input() value: number = 0;
}

@Component({
  standalone: true,
  selector: 'mc-root',
  imports: [CounterComponent],
  template: `<mc-counter [value]="value"></mc-counter>`,
})
export class AppComponent {
  value = 42;
}
