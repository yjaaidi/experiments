import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { RecipeRepository } from './recipe-repository.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { RecipeFilterComponent } from './recipe-filter.component';
import { CatalogComponent } from './catalog.component';
import { RecipePreviewComponent } from './recipe-preview.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    AsyncPipe,
    NgFor,
    RecipeFilterComponent,
    CatalogComponent,
    RecipePreviewComponent,
  ],
  template: ` <wm-recipe-filter
      (filterChange)="onFilterChange($event)"
    ></wm-recipe-filter>
    <wm-catalog>
      <wm-recipe-preview
        *ngFor="let recipe of recipes$ | async; trackBy: trackById"
        [recipe]="recipe"
      ></wm-recipe-preview>
    </wm-catalog>`,
})
export class RecipeSearchComponent {
  filter$ = new BehaviorSubject<RecipeFilter>({});
  recipes$ = this.filter$.pipe(
    switchMap((filter) => this._recipeRepository.search(filter))
  );

  private _recipeRepository = inject(RecipeRepository);

  onFilterChange(filter: RecipeFilter) {
    this.filter$.next(filter);
  }

  trackById(_: number, recipe: Recipe) {
    return recipe.id;
  }
}
