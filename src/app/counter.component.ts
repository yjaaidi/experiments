import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { interval } from 'rxjs';
import { ThrottleStrategyDirective } from './throttle-strategy.directive';
import { ViewportStrategyDirective } from './viewport-strategy.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'mc-counter',
  imports: [NgFor, ThrottleStrategyDirective, ViewportStrategyDirective],
  styles: [
    `
      .header {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
    `,
  ],
  template: `
    <div class="header">👇 Scroll down 👇</div>
    <ng-container *ngFor="let _ of lines">
      <div *viewportStrategy>
        <span>{{ count() }}</span>
        <!-- <span>{{ logChangeDetection() }}</span> -->
      </div>
    </ng-container>
  `,
})
export class CounterComponent implements OnDestroy {
  count = signal(0);
  lines = Array(10000);
  // throttledCount = throttleSignal(this.count, {duration: 1000});

  private _sub = interval(100).subscribe(() => this.count.update((c) => c + 1));

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  logChangeDetection() {
    console.count('change detection');
  }
}
