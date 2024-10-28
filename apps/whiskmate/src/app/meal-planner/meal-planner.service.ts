import { inject, Injectable, signal, untracked } from '@angular/core';
import { Recipe } from '../recipe/recipe';
import { MealRepository } from './meal-repository.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  recipes = this._recipes.asReadonly();

  private _mealRepository = inject(MealRepository);

  constructor() {
    this._mealRepository
      .getMeals()
      .pipe(takeUntilDestroyed())
      .subscribe((recipes) =>
        this._recipes.set([...recipes, ...this._recipes()]),
      );
  }

  canAddRecipe(recipe: Recipe): boolean {
    return this._recipes().find((r) => r.id === recipe.id) == null;
  }

  async addRecipe(recipe: Recipe) {
    if (!untracked(() => this.canAddRecipe(recipe))) {
      throw new Error(`Can't add recipe.`);
    }
    await this._mealRepository.addMeal(recipe);
    this._recipes.update((recipes) => [...recipes, recipe]);
  }

  async removeMeal(recipeId: string) {
    await this._mealRepository.removeMeal(recipeId);
    this._recipes.update((recipes) =>
      recipes.filter(({ id }) => id !== recipeId),
    );
  }
}
