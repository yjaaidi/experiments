import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest } from 'rxjs';
import { MealPlanner } from './../meal-planner/meal-planner.service';
import { CatalogComponent } from './../shared/catalog.component';
import { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { RecipeRepository } from './recipe-repository.service';
import { rxComputed } from '@jscutlery/rx-computed';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-search',
  imports: [
    AsyncPipe,
    CatalogComponent,
    MatButtonModule,
    NgForOf,
    RecipeFilterComponent,
    RecipePreviewComponent,
  ],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)"></wm-recipe-filter>
    <wm-catalog>
      @for(recipe of recipes(); track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <button
          [disabled]="!canAddRecord()[recipe.id]"
          (click)="addRecipe(recipe)"
          class="add-recipe-button"
          color="primary"
          data-role="add-recipe"
          mat-stroked-button
        >
          ADD
        </button>
      </wm-recipe-preview>
      }
    </wm-catalog>
  `,
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
  filter = signal<RecipeFilter>({});
  recipes = rxComputed(() => this._recipeRepository.search(this.filter()));
  canAddRecord: Signal<Record<string, boolean>> = rxComputed(() => {
    const canAddObsRecord =
      this.recipes()?.reduce(
        (acc, recipe) => ({
          ...acc,
          [recipe.id]: this._mealPlanner.watchCanAddRecipe(recipe),
        }),
        {}
      ) ?? {};
    return combineLatest(canAddObsRecord);
  });

  private _mealPlanner = inject(MealPlanner);
  private _recipeRepository = inject(RecipeRepository);

  addRecipe(recipe: Recipe) {
    this._mealPlanner.addRecipe(recipe);
  }
}

export default RecipeSearchComponent;
