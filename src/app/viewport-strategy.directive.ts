import { Directive, effect, inject, signal } from '@angular/core';
import { animationFrameScheduler, observeOn, startWith } from 'rxjs';
import { ManualChangeDetector } from './manual-change-detector.directive';

@Directive({
  standalone: true,
  selector: '[viewportStrategy]',
  hostDirectives: [ManualChangeDetector],
})
export class ViewportStrategyDirective {
  private _manualChangeDetector = inject(ManualChangeDetector);
  private _isIntersecting = signal(false);

  constructor() {
    /* Track if first root element is intersecting with viewport. */
    effect(() => {
      const rootEl = this._manualChangeDetector.firstRootElement() as Element;
      if (rootEl == null) {
        return;
      }

      const intersectionObserver = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          this._isIntersecting.set(isIntersecting);
        },
        {
          /* We are using a high threshold to allow users to notice the effect.
           * In real-life, you will want a low threshold so users don't notice.*/
          threshold: 0,
        }
      );
      intersectionObserver.observe(rootEl);
      return () => intersectionObserver.unobserve(rootEl);
    });

    /* Trigger change detection when view is in viewport. */
    effect(() => {
      if (!this._isIntersecting()) {
        return;
      }

      const sub = this._manualChangeDetector.depsChanged$
        .pipe(startWith(undefined), observeOn(animationFrameScheduler))
        .subscribe(() => this._manualChangeDetector.detectChanges());
      return () => sub.unsubscribe();
    });
  }
}
