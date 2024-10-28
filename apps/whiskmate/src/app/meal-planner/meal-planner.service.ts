import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Recipe } from '../recipe/recipe';
import { MealRepository } from './meal-repository.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MealPlanner {
  recipes$: Observable<Recipe[]>;

  private _mealRepository = inject(MealRepository);
  private _recipes$ = new BehaviorSubject<Recipe[]>([]);

  constructor() {
    this.recipes$ = this._recipes$.asObservable();

    this._mealRepository
      .getMeals()
      .pipe(takeUntilDestroyed())
      .subscribe((recipes) =>
        this._recipes$.next([...recipes, ...this._recipes$.value]),
      );
  }

  async addRecipe(recipe: Recipe) {
    if (!this._canAddRecipe({ recipe, recipes: this._recipes$.value })) {
      throw new Error(`Can't add recipe.`);
    }
    await this._mealRepository.addMeal(recipe);
    this._recipes$.next([...this._recipes$.value, recipe]);
  }

  watchCanAddRecipe(recipe: Recipe): Observable<boolean> {
    return this._recipes$.pipe(
      map((recipes) => this._canAddRecipe({ recipe, recipes })),
      distinctUntilChanged(),
    );
  }

  async removeMeal(recipeId: string) {
    await this._mealRepository.removeMeal(recipeId);
    this._recipes$.next(
      this._recipes$.value.filter((recipe) => recipe.id !== recipeId),
    );
  }

  private _canAddRecipe({
    recipes,
    recipe,
  }: {
    recipes: Recipe[];
    recipe: Recipe;
  }) {
    return !recipes.find((_recipe) => _recipe.id === recipe.id);
  }
}
