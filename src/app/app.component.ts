import { AsyncPipe, NgFor } from '@angular/common';
import {
  Component,
  Directive,
  Injectable,
  Input,
  Pipe,
  Signal,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import {
  EMPTY,
  Observable,
  catchError,
  first,
  interval,
  of,
  startWith,
  switchMap,
  throwError
} from 'rxjs';

@Injectable()
export class ErrorBoundaryError {
  error: Signal<unknown>;
  private _error = signal<unknown>(undefined);
  constructor() {
    this.error = this._error.asReadonly();
  }

  setError(error: unknown) {
    queueMicrotask(() => this._error.set(error));
  }

  reset() {
    this._error.set(null);
  }
}

@Directive({
  standalone: true,
  selector: '[errorBoundary]',
  providers: [ErrorBoundaryError],
})
export class ErrorBoundaryDirective {
  @Input() errorBoundaryContent?: TemplateRef<unknown>;
  @Input() errorBoundaryFallback!: TemplateRef<unknown>;

  private _errorBoundaryError = inject(ErrorBoundaryError);

  constructor() {
    const templateRef = this.errorBoundaryContent ?? inject(TemplateRef);
    const vcr = inject(ViewContainerRef);
    effect(() => {
      const error = this._errorBoundaryError.error();
      vcr.clear();
      if (error == null) {
        vcr.createEmbeddedView(templateRef);
      } else {
        vcr.createEmbeddedView(this.errorBoundaryFallback, {
          $implicit: error,
          reset: () => this.reset(),
        });
      }
    });
  }

  reset() {
    this._errorBoundaryError.reset();
  }
}

@Pipe({
  standalone: true,
  name: 'catch',
})
export class CatchPipe {
  private _errorBoundaryError = inject(ErrorBoundaryError);

  transform<T>(source$: Observable<T>): Observable<T> {
    return source$.pipe(
      catchError((error) => {
        this._errorBoundaryError.setError(error);
        return EMPTY;
      })
    );
  }
}

@Pipe({
  standalone: true,
  name: 'signal',
  pure: false,
})
export class SignalPipe {
  private _errorBoundaryError = inject(ErrorBoundaryError);
  transform<T>(signal: Signal<T>): T | null {
    try {
      return signal();
    } catch (error) {
      this._errorBoundaryError.setError(error);
      return null;
    }
  }
}

@Component({
  standalone: true,
  selector: 'app-article',
  imports: [CatchPipe, AsyncPipe],
  template: `
    <h2>{{ title }}</h2>
    <p>{{ content$ | catch | async }}</p>
  `,
})
export class ArticleComponent {
  @Input() title?: string;

  content$ = interval(1000).pipe(
    first(),
    switchMap(() => {
      if (this.title?.includes('Broken')) {
        return throwError(() => new Error('💥'));
      }
      return of(`${this.title} content`);
    }),
    startWith('Loading...')
  );
}

@Component({
  standalone: true,
  selector: 'app-article-signal',
  imports: [SignalPipe],
  template: `
    <h2>{{ title }}</h2>
    <p>{{ content | signal }}</p>
  `,
})
export class ArticleSignalComponent {
  @Input() set title(title: string) {
    setTimeout(() => this._title.set(title), 1000);
  }

  content = computed(() => {
    const title = this._title();
    if (title?.includes('Broken')) {
      throw new Error('💥');
    }
    return title ? `${title} content` : 'Loading...';
  });

  private _title = signal<string | null>(null);
}

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    ArticleComponent,
    ArticleSignalComponent,
    ErrorBoundaryDirective,
    NgFor,
  ],
  template: `
    <h1>Articles</h1>

    <hr />

    <ng-container *ngFor="let article of articles">
      <ng-template errorBoundary [errorBoundaryFallback]="errorTemplate">
        <app-article [title]="article" />
      </ng-template>
      <hr />
    </ng-container>

    <h1>Signal-based Articles</h1>

    <ng-container *ngFor="let article of articles">
      <ng-template errorBoundary [errorBoundaryFallback]="errorTemplate">
        <app-article-signal [title]="article" />
      </ng-template>
      <hr />
    </ng-container>

    <ng-template #errorTemplate let-error let-reset="reset"
      >Oups! Something went wrong: {{ error }}
      <button (click)="reset()">Retry</button>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class AppComponent {
  articles = ['An Article', 'A Broken Article'];
}
