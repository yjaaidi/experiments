import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CatalogComponent } from './../shared/catalog.component';
import { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-search',
  imports: [
    AsyncPipe,
    CatalogComponent,
    MatButtonModule,
    NgFor,
    RecipeFilterComponent,
    RecipePreviewComponent,
  ],
  template: `
    <wm-recipe-filter
      (filterChange)="onFilterChange($event)"
    ></wm-recipe-filter>
    <wm-catalog>
      <wm-recipe-preview
        *ngFor="let recipe of recipes$ | async; trackBy: trackById"
        [recipe]="recipe"
      >
        <button mat-button color="primary">ADD</button>
      </wm-recipe-preview>
    </wm-catalog>
  `,
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
