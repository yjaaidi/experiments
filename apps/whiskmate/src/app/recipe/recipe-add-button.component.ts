import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { Recipe } from './recipe';
import { MatButtonModule } from '@angular/material/button';
import { rxComputed } from '@jscutlery/rx-computed';
import { MealPlanner } from '../meal-planner/meal-planner.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-add-button',
  imports: [MatButtonModule],
  template: ` <button
    [disabled]="!canAddRecipe()"
    (click)="addRecipe()"
    class="add-recipe-button"
    color="primary"
    data-role="add-recipe"
    mat-stroked-button
  >
    ADD
  </button>`,
})
export class RecipeAddButtonComponent {
  @Input({ required: true }) set recipe(recipe: Recipe) {
    this._recipe.set(recipe);
  }

  canAddRecipe = rxComputed(() =>
    this._mealPlanner.watchCanAddRecipe(this._notNullRecipe())
  );

  private _mealPlanner = inject(MealPlanner);
  private _recipe = signal<Recipe | null>(null);
  /* @hack: derivate a not-null signal from original signal
   * until signal inputs are implemented in Angular. */
  private _notNullRecipe = () => {
    const recipe = this._recipe();
    if (recipe == null) {
      throw new Error('RecipeAddButtonComponent.recipe is null');
    }
    return recipe;
  };

  addRecipe() {
    this._mealPlanner.addRecipe(this._notNullRecipe());
  }
}
