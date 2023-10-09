import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { rxComputed } from '@jscutlery/rx-computed';
import { pending, suspensify } from '@jscutlery/operators';
import { combineLatest } from 'rxjs';
import { MealPlanner } from '../meal-planner/meal-planner.service';
import { GridComponent } from '../shared/grid.component';
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
    GridComponent,
    MatButtonModule,
    NgIf,
    RecipeFilterComponent,
    RecipePreviewComponent,
    NgForOf,
  ],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)"></wm-recipe-filter>

    <wm-grid>
      <span *ngIf="recipesSuspense().pending">⏳ Searching...</span>

      <span *ngIf="recipesSuspense().hasError">💥 Something went wrong.</span>

      <wm-recipe-preview
        *ngFor="let recipe of recipes(); trackBy: trackById"
        [recipe]="recipe"
      >
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
    </wm-grid>
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
  recipesSuspense = rxComputed(
    () => this._recipeRepository.search(this.filter()).pipe(suspensify()),
    { initialValue: pending }
  );
  recipes = () => {
    const suspense = this.recipesSuspense();
    return suspense.hasValue ? suspense.value : [];
  };
  canAddRecord: Signal<Record<string, boolean>> = rxComputed(() => {
    const suspense = this.recipesSuspense();
    const recipes = suspense?.hasValue ? suspense.value : [];
    const canAddObsRecord =
      recipes?.reduce(
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

  trackById(_: number, recipe: Recipe) {
    return recipe.id;
  }
}

export default RecipeSearchComponent;
