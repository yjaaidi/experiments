import { Directive, inject, OnDestroy } from '@angular/core';
import {
  animationFrameScheduler,
  observeOn,
  throttleTime
} from 'rxjs';
import { ManualChangeDetector } from './manual-change-detector.directive';

@Directive({
  standalone: true,
  selector: '[throttleStrategy]',
  hostDirectives: [ManualChangeDetector],
})
export class ThrottleStrategyDirective implements OnDestroy {
  private _manualChangeDetector = inject(ManualChangeDetector);
  private _subscription = this._manualChangeDetector.depsChanged$
    .pipe(throttleTime(1000), observeOn(animationFrameScheduler))
    .subscribe(() => this._manualChangeDetector.detectChanges());

  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }
}
