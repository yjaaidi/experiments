import { Injectable } from '@angular/core';
import { RxState, select } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../recipe/recipe';

@Injectable({
  providedIn: 'root',
})
export class MealPlanner {
  recipes$: Observable<Recipe[]>;

  private _state = new RxState<{ recipes: Recipe[] }>();

  constructor() {
    this._state.set({ recipes: [] });
    this.recipes$ = this._state.select(map((state) => state.recipes));
  }

  addRecipe(recipe: Recipe) {
    if (!this._canAddRecipe({ recipe, recipes: this._state.get('recipes') })) {
      throw new Error(`Can't add recipe.`);
    }
    this._state.set(({ recipes }) => ({ recipes: [...recipes, recipe] }));
  }

  watchCanAddRecipe(recipe: Recipe): Observable<boolean> {
    return this._state
      .select('recipes')
      .pipe(select(map((recipes) => this._canAddRecipe({ recipe, recipes }))));
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
