import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RecipeRepository } from '../recipe-repository/recipe-repository.service';
import { Recipe } from '../recipe/recipe';
import { RecipeFilter } from '../recipe/recipe-filter';
import { CatalogComponent } from './../shared/catalog.component';
import { MealPlanner } from './meal-planner.service';
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
        <div>
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

  /* Using inject to avoid NG0202 error with ts-jest or @swc/jest.
   * This happens because jest-preset-angular is using Angular's downlevel constructor transform
   * to keep the constructor's param types.
   * Cf. https://github.com/angular/angular/issues/47606
   * Cf. https://github.com/thymikee/jest-preset-angular/blob/f24156ea1f7532c02c44d8d023b54623a4bccccd/scripts/prebuild.js
   * Cf. https://github.com/angular/angular/blob/3a60063a54d850c50ce962a8a39ce01cfee71398/packages/compiler-cli/src/transformers/downlevel_decorators_transform/downlevel_decorators_transform.ts */
  private _mealPlanner = inject(MealPlanner);
  private _recipeRepository = inject(RecipeRepository);

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
