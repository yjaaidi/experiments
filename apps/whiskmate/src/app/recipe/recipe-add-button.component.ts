import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Recipe } from './recipe';
import { MatButtonModule } from '@angular/material/button';
import { MealPlanner } from '../meal-planner/meal-planner.service';
import { derivedAsync } from 'ngxtension/derived-async';

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
  recipe = input.required<Recipe>();

  canAddRecipe = derivedAsync(() =>
    this._mealPlanner.watchCanAddRecipe(this.recipe())
  );

  private _mealPlanner = inject(MealPlanner);

  addRecipe() {
    this._mealPlanner.addRecipe(this.recipe());
  }
}
