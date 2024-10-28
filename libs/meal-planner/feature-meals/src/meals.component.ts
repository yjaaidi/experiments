import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MealPlanner } from '@whiskmate/meal-planner/domain';
import { Recipe } from '@whiskmate/recipe-shared/core';
import { MatButtonModule } from '@angular/material/button';

import { MessageComponent } from '@whiskmate/shared/ui';
import { RecipeListComponent } from '@whiskmate/recipe-shared/ui';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-meals',
  imports: [RecipeListComponent, MatButtonModule, MessageComponent],
  template: `
    @if (recipes().length === 0) {
      <wm-message>😬 No meals yet</wm-message>
    }
    <wm-recipe-list [recipes]="recipes()">
      <ng-template #actions let-recipe>
        <button (click)="removeMeal(recipe)" color="warn" mat-stroked-button>
          REMOVE
        </button>
      </ng-template>
    </wm-recipe-list>
  `,
})
export class MealsComponent {
  private _mealPlanner = inject(MealPlanner);

  recipes = this._mealPlanner.recipes;

  async removeMeal(recipe: Recipe) {
    await this._mealPlanner.removeMeal(recipe.id);
  }
}

export default MealsComponent;
