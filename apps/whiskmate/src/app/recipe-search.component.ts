import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TrackByFunction,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { suspensify } from '@jscutlery/operators';
import {
  BehaviorSubject,
  combineLatest,
  map,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { RecipeFilter } from './recipe-filter.component';
import { Paginator } from '../shared/paginator.component';
import { RecipePreview } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository';
import { Catalog } from '../shared/catalog.component';
import { Recipe } from './recipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  template: `
    @if ((recipesSuspense$ | async)?.pending) {
      <mat-progress-bar class="progress-bar" mode="indeterminate" />
    }

    <wm-recipe-filter (keywordsChange)="keywords$.next($event)" />

    @if (recipesSuspense$ | async; as recipesSuspense) {
      <wm-catalog>
        @if (recipesSuspense.hasError) {
          <p>Something went wrong</p>
        }
        @if (recipesSuspense.hasValue) {
          @for (recipe of recipesSuspense.value.items; track recipe.id) {
            <wm-recipe-preview [recipe]="recipe" />
          }
        }
      </wm-catalog>
    }

    <wm-paginator
      [itemsPerPage]="(itemsPerPage$ | async) ?? 10"
      [offset]="(computedOffset$ | async) ?? 0"
      [total]="(total$ | async) ?? 0"
      (offsetChange)="offset$.next($event)"
    />
  `,
  styles: `
    :host {
      display: block;
      margin: auto;
      text-align: center;
    }

    .progress-bar {
      position: fixed;
      top: 0;
    }
  `,
  imports: [
    MatProgressBar,
    RecipeFilter,
    Catalog,
    RecipePreview,
    Paginator,
    AsyncPipe,
  ],
})
export class RecipeSearch {
  keywords$ = new BehaviorSubject<string | undefined>(undefined);
  offset$ = new Subject<number>();
  computedOffset$ = this.keywords$.pipe(
    switchMap(() => this.offset$.pipe(startWith(0))),
  );
  recipesSuspense$ = combineLatest({
    keywords: this.keywords$,
    offset: this.computedOffset$,
  }).pipe(
    switchMap(({ keywords, offset }) => {
      return this._recipeRepository
        .search({ keywords, offset })
        .pipe(suspensify());
    }),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );
  itemsPerPage$ = this.recipesSuspense$.pipe(
    map((suspense) => (suspense.hasValue ? suspense.value.items.length : 10)),
  );
  total$ = this.recipesSuspense$.pipe(
    map((suspense) => (suspense.hasValue ? suspense.value.total : 0)),
  );

  private _recipeRepository = inject(RecipeRepository);
}
