import { Observable } from 'rxjs';
import { Recipe } from '@whiskmate/recipe-shared/core';
import { RecipeFilter } from './recipe-filter';

export interface RecipeRepositoryDef {
  search(filter: RecipeFilter): Observable<Recipe[]>;
}
