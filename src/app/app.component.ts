import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  Directive,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  animationFrameScheduler,
  EMPTY,
  interval,
  Observable,
  observeOn,
  ReplaySubject,
  startWith,
  Subject,
  switchMap,
  throttleTime,
} from 'rxjs';

const DEBUG = false;
const REACTIVE_TEMPLATE_CONSUMER = 24;

@Injectable()
export class Renderer {
  depsChanged$: Observable<void>;

  _cdr = inject(ChangeDetectorRef);
  _injector = inject(Injector);
  _templateRef = inject(TemplateRef);
  _vcr = inject(ViewContainerRef);

  _depsChanged$ = new Subject<void>();
  _viewRef?: EmbeddedViewRef<unknown>;

  constructor() {
    this.depsChanged$ = this._depsChanged$.asObservable();
  }

  init() {
    this._viewRef = this._vcr.createEmbeddedView(this._templateRef);

    /* Trigger change detection to initialize reactive template consumer. */
    this._viewRef.detectChanges();

    /* Let's take control of change detection. */
    this._viewRef.detach();
    const reactiveNode = (this._viewRef as any)['_lView'][
      REACTIVE_TEMPLATE_CONSUMER
    ];

    reactiveNode.onConsumerDependencyMayHaveChanged = () =>
      this._depsChanged$.next();

    return { nativeElement: this._viewRef.rootNodes[0] };
  }

  detectChanges() {
    this._viewRef?.detectChanges();
  }
}

@Directive({
  standalone: true,
  selector: '[throttle]',
  providers: [Renderer],
})
export class ThrottleDirective implements OnInit, OnDestroy {
  _renderer = inject(Renderer);
  _sub = this._renderer._depsChanged$
    .pipe(observeOn(animationFrameScheduler), throttleTime(1000))
    .subscribe(() => this._renderer.detectChanges());

  ngOnInit() {
    this._renderer.init();
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}

@Directive({
  standalone: true,
  selector: '[viewport]',
  providers: [Renderer],
})
export class ViewportDirective implements OnInit, OnDestroy {
  _renderer = inject(Renderer);

  _nativeElement$ = new ReplaySubject<HTMLElement>(1);
  _isIntersecting$ = this._nativeElement$.pipe(
    switchMap((nativeElement) => {
      return new Observable<boolean>((observer) => {
        const intersectionObserver = new IntersectionObserver(
          ([{ isIntersecting }]) => {
            observer.next(isIntersecting);
          },
          {
            /* We are using a high threshold to allow users to notice the effect.
             * In real-life, you will want a low threshold so users don't notice.*/
            threshold: 0,
          }
        );
        intersectionObserver.observe(nativeElement);
        return () => intersectionObserver.unobserve(nativeElement);
      });
    })
  );
  _sub = this._isIntersecting$
    .pipe(
      switchMap((isIntersecting) =>
        isIntersecting
          ? this._renderer.depsChanged$.pipe(startWith(undefined))
          : EMPTY
      ),
      observeOn(animationFrameScheduler)
    )
    .subscribe(() => {
      DEBUG && console.count('detectChanges');
      this._renderer.detectChanges();
    });

  ngOnInit() {
    const { nativeElement } = this._renderer.init();
    this._nativeElement$.next(nativeElement);
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'mc-counter',
  imports: [NgFor, ViewportDirective],
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
      <div>{{ count() }} x 2 = {{ double() }}</div>
    </ng-container>
  `,
})
export class CounterComponent implements OnDestroy {
  count = signal(0);
  double = computed(() => {
    DEBUG && console.count('compute double');
    return this.count() * 2;
  });
  lines = Array.from(Array(10_000));

  _sub = interval(100).subscribe(() => this.count.update((c) => c + 1));

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}

@Injectable({ providedIn: 'root' })
class Count {
  count = signal(0);
}

const GadgetComponent = cmp({
  selector: 'mc-gadget',
  template: `
  <div>{{count()}}</div>
  <button (click)="increment()">INCREMENT</button>
  `,
  data() {
    const { count } = inject(Count);

    return {
      count,
      increment() {
        count.update((c) => c + 1);
      },
    };
  },
});

import '@angular/compiler';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<ng-container #container1/><ng-container #container2/><mc-counter/>`,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        font-size: 2em;
      }
    `,
  ],
  imports: [CounterComponent],
})
export class AppComponent {
  @ViewChild('container1', { read: ViewContainerRef, static: true })
  container1!: ViewContainerRef;
  @ViewChild('container2', { read: ViewContainerRef, static: true })
  container2!: ViewContainerRef;
  ngOnInit() {
    this.container1.createComponent(GadgetComponent);
    this.container2.createComponent(GadgetComponent);
  }
}

function cmp<DATA extends Record<string, unknown>>(
  meta: Component & { data: () => DATA }
) {
  return Component(meta)(
    class {
      constructor() {
        Object.assign(this, meta.data());
      }
    }
  );
}
