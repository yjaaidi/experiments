import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Recipe } from '@whiskmate/recipe-shared/core';
import { MatButtonModule } from '@angular/material/button';
import { MealPlanner } from '@whiskmate/meal-planner/domain';

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

  canAddRecipe = computed(() => this._mealPlanner.canAddRecipe(this.recipe()));

  private _mealPlanner = inject(MealPlanner);

  async addRecipe() {
    await this._mealPlanner.addRecipe(this.recipe());
  }
}
