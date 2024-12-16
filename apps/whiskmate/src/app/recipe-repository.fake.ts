import {
  EnvironmentProviders,
  Injectable,
  makeEnvironmentProviders,
} from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import { RecipeRepository } from './recipe-repository';
import { Recipe } from './recipe';

@Injectable()
export class RecipeRepositoryFake implements RecipeRepository {
  private _delay = 0;
  private _pageSize = 3;
  private _recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]): void {
    this._recipes = recipes;
  }

  search({
    keywords,
    offset = 0,
  }: {
    keywords?: string;
    offset?: number;
  } = {}): Observable<{ items: Recipe[]; total: number }> {
    return defer(() => {
      const filteredRecipes = this._recipes.filter((r) => {
        if (!keywords) {
          return true;
        }

        return r.name
          .toLocaleLowerCase()
          .includes(keywords.toLocaleLowerCase());
      });
      return of({
        items: filteredRecipes.slice(offset, offset + this._pageSize),
        total: filteredRecipes.length,
      }).pipe(delay(this._delay));
    });
  }

  setDelay(delay: number) {
    this._delay = delay;
  }
}

export function provideRecipeRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([
    RecipeRepositoryFake,
    { provide: RecipeRepository, useExisting: RecipeRepositoryFake },
  ]);
}
