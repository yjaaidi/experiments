import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { Recipe } from '@whiskmate/recipe-shared/core';
import { MessageComponent } from '@whiskmate/shared/ui';
import { RecipeListComponent } from '@whiskmate/recipe-shared/ui';
import { MealPlanner } from '@whiskmate/meal-planner/store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-meals',
  imports: [RecipeListComponent, MatButtonModule, NgIf, MessageComponent],
  template: `
    <wm-message *ngIf="recipes().length === 0">😬 No meals yet</wm-message>

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
  recipes: Signal<Recipe[]>;

  private _mealPlanner = inject(MealPlanner);

  constructor() {
    this.recipes = toSignal(this._mealPlanner.recipes$, { initialValue: [] });
  }

  removeMeal(recipe: Recipe) {
    this._mealPlanner.removeMeal(recipe.id);
  }
}

export default MealsComponent;
