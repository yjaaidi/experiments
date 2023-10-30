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
      /* Return true if all conditions are true. */
      return keywords ? recipe.name.includes(keywords) : true;
    });

    return of(recipes);
  }

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
  }
}
