import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RecipeRepository } from '../recipe-repository/recipe-repository.service';
import { RecipeFilter } from '../recipe/recipe-filter';
import { CatalogComponent } from './../shared/catalog.component';
import { MealPlanner } from './meal-planner.service';
import { Recipe } from '../recipe/recipe';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipePreviewComponent } from './recipe-preview.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    AsyncPipe,
    CatalogComponent,
    NgFor,
    MatButtonModule,
    RecipeFilterComponent,
    RecipePreviewComponent,
  ],
  template: ` <wm-recipe-filter
      (filterChange)="onFilterChange($event)"
    ></wm-recipe-filter>
    <wm-catalog>
      <wm-recipe-preview
        *ngFor="let item of items$ | async; trackBy: trackById"
        [recipe]="item.recipe"
      >
        <div class="container">
          <button
            [disabled]="(item.canAdd$ | async) === false"
            (click)="addRecipe(item.recipe)"
            class="add-recipe-button"
            color="primary"
            data-role="add-recipe"
            mat-stroked-button
          >
            ADD
          </button>
        </div>
      </wm-recipe-preview>
    </wm-catalog>`,
  styles: [
    `
      .add-recipe-button {
        display: block;
        margin: auto;
      }
    `,
  ],
})
export class RecipeSearchComponent {
  filter$ = new BehaviorSubject<RecipeFilter>({});
  items$ = this.filter$.pipe(
    switchMap((filter) => this._recipeRepository.search(filter)),
    map((recipes) =>
      recipes.map((recipe) => ({
        canAdd$: this._mealPlanner.watchCanAddRecipe(recipe),
        recipe,
      }))
    )
  );

  constructor(
    private _mealPlanner: MealPlanner,
    private _recipeRepository: RecipeRepository
  ) {}

  addRecipe(recipe: Recipe) {
    this._mealPlanner.addRecipe(recipe);
  }

  onFilterChange(filter: RecipeFilter) {
    this.filter$.next(filter);
  }

  trackById(_: number, { recipe }: { recipe: Recipe }) {
    return recipe.id;
  }
}
