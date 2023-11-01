import { Injectable, Provider } from '@angular/core';
import {
  RecipeRepository,
  RecipeRepositoryDef,
} from './recipe-repository.service';
import { defer, Observable, of } from 'rxjs';
import { Recipe } from './recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private _recipes: Recipe[] = [];

  search(keywords?: string): Observable<Recipe[]> {
    return defer(() => {
      const recipes = this._recipes.filter((recipe) =>
        keywords
          ? recipe.name.toLowerCase().includes(keywords.toLowerCase())
          : true
      );
      return of(recipes);
    });
  }

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
  }
}

/**
 * This provides both `RecipeRepository` and `RecipeRepositoryFake`
 * using the same instance of `RecipeRepositoryFake`.
 * This avoids having to manually cast `RecipeRepository` into `RecipeRepositoryFake`.
 */
export function provideRecipeRepositoryFake(): Provider[] {
  return [
    RecipeRepositoryFake,
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake,
    },
  ];
}
