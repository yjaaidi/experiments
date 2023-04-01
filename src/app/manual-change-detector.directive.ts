import {
  computed,
  Directive,
  EmbeddedViewRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

const REACTIVE_HOST_BINDING_CONSUMER = 24;

@Directive({
  standalone: true,
})
export class ManualChangeDetector implements OnInit {
  depsChanged$: Observable<void>;
  /* Convert to readonly signal. */
  firstRootElement = computed(() => this._firstRootElement());

  private _templateRef = inject(TemplateRef);
  private _vcr = inject(ViewContainerRef);

  private _firstRootElement = signal<Element | null>(null);
  private _depsChanged$ = new Subject<void>();
  private _viewRef?: EmbeddedViewRef<unknown>;

  constructor() {
    this.depsChanged$ = this._depsChanged$.asObservable();
  }

  ngOnInit() {
    /*
     * Override change detection as soon as possible.
     */
    this._viewRef = this._vcr.createEmbeddedView(this._templateRef);

    /* Trigger change detection to initialize reactive view consumer. */
    this._viewRef.detectChanges();

    /* Let's take control of change detection. */
    this._viewRef.detach();
    const reactiveViewConsumer = (this._viewRef as any)['_lView'][
      REACTIVE_HOST_BINDING_CONSUMER
    ];

    reactiveViewConsumer.onConsumerDependencyMayHaveChanged = () =>
      this._depsChanged$.next();

    /* Grab first root element... mainly used by viewport strategy. */
    this._firstRootElement.set(this._viewRef.rootNodes[0]);
  }

  detectChanges() {
    if (this._viewRef == null) {
      throw new Error(
        "Can't call detectChanges before component is initialized."
      );
    }
    this._viewRef.detectChanges();
  }
}
