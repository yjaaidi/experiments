import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NgModule,
  TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { suspensify } from '@jscutlery/operators';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { RecipeFilterModule } from './recipe-filter.component';
import { PaginatorModule } from '../shared/paginator.component';
import { RecipePreviewModule } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository';
import { Catalog } from '../shared/catalog.component';
import { Recipe } from './recipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  template: `
    <mat-progress-bar
      *ngIf="(recipesSuspense$ | async)?.pending"
      class="progress-bar"
      mode="indeterminate"
    />

    <wm-recipe-filter (keywordsChange)="keywords$.next($event)" />

    <wm-catalog *ngIf="recipesSuspense$ | async as recipesSuspense">
      <ng-container *ngIf="recipesSuspense.hasError">
        <p>Something went wrong</p>
      </ng-container>
      <ng-container *ngIf="recipesSuspense.hasValue">
        <wm-recipe-preview
          *ngFor="let recipe of recipesSuspense.value.items; trackBy: trackById"
          [recipe]="recipe"
        />
      </ng-container>
    </wm-catalog>

    <wm-paginator
      [itemsPerPage]="(itemsPerPage$ | async) ?? 10"
      [offset]="(computedOffset$ | async) ?? 0"
      [total]="(total$ | async) ?? 0"
      (offsetChange)="offset$.next($event)"
    />
  `,
  styles: [
    `
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
  ],
  standalone: false,
})
export class RecipeSearch {
  keywords$ = new BehaviorSubject<string | undefined>(undefined);
  offset$ = new Subject<number>();
  computedOffset$ = this.keywords$.pipe(
    switchMap(() => this.offset$.pipe(startWith(0)))
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
    })
  );
  itemsPerPage$ = this.recipesSuspense$.pipe(
    map((suspense) => (suspense.hasValue ? suspense.value.items.length : 10))
  );
  total$ = this.recipesSuspense$.pipe(
    map((suspense) => (suspense.hasValue ? suspense.value.total : 0))
  );

  private _recipeRepository = inject(RecipeRepository);

  trackById: TrackByFunction<Recipe> = (_, recipe) => recipe.id;
}

@NgModule({
  declarations: [RecipeSearch],
  imports: [
    Catalog,
    CommonModule,
    PaginatorModule,
    RecipeFilterModule,
    RecipePreviewModule,
    MatProgressBar,
  ],
  exports: [RecipeSearch],
})
export class RecipeSearchModule {}
