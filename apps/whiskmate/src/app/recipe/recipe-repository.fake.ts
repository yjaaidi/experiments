import { Injectable } from '@angular/core';
import { RecipeFilter } from './recipe-filter';
import { Observable, of } from 'rxjs';
import { Recipe } from './recipe';
import { RecipeRepositoryDef } from './recipe-repository.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private _recipes: Recipe[] = [];

  search({
    keywords,
    maxIngredientCount,
    maxStepCount,
  }: RecipeFilter = {}): Observable<Recipe[]> {
    const recipes = this._recipes.filter((recipe) => {
      const conditions = [
        /* Filter by keywords. */
        () => (keywords ? recipe.name.includes(keywords) : true),
        /* Filter by max ingredients. */
        () =>
          maxIngredientCount != null
            ? recipe.ingredients.length <= maxIngredientCount
            : true,
        /* Filter by max steps. */
        () =>
          maxStepCount != null ? recipe.steps.length <= maxStepCount : true,
      ];

      /* Return true if all conditions are true. */
      return conditions.every((condition) => condition());
    });

    return of(recipes);
  }

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
  }
}
