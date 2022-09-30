import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipe/recipe';

@Injectable({
  providedIn: 'root',
})
export class MealPlanner {
  recipes$: Observable<Recipe[]>;

  private _recipes$ = new BehaviorSubject<Recipe[]>([]);

  constructor() {
    this.recipes$ = this._recipes$.asObservable();
  }

  addRecipe(recipe: Recipe) {
    if (!this.canAddRecipe(recipe)) {
      throw new Error(`Can't add recipe.`);
    }
    this._recipes$.next([...this._recipes$.value, recipe]);
  }

  watchCanAddRecipe(recipe: Recipe): Observable<boolean> {
    return this._recipes$.pipe(
      map((recipes) => this._canAddRecipes({ recipe, recipes })),
      distinctUntilChanged()
    );
  }

  /**
   * @deprecated use `watchCanAddRecipe` instead.
   */
  canAddRecipe(recipe: Recipe): boolean {
    return this._canAddRecipes({ recipe, recipes: this.getRecipes() });
  }

  /**
   * @deprecated use `recipes$` instead.
   */
  getRecipes(): Recipe[] {
    return this._recipes$.value;
  }

  private _canAddRecipes({
    recipes,
    recipe,
  }: {
    recipes: Recipe[];
    recipe: Recipe;
  }) {
    return !recipes.find((_recipe) => _recipe.id === recipe.id);
  }
}
