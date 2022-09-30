import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe/recipe';
import { RecipeFilter } from '../recipe/recipe-filter';
import { RecipeRepositoryPort } from './recipe-repository.port';

@Injectable({
  providedIn: 'root',
})
export class RecipeRepositoryImpl implements RecipeRepositoryPort {
  search({
    keywords,
    maxIngredientCount,
    maxStepCount,
  }: RecipeFilter = {}): Observable<Recipe[]> {
    throw new Error('🚧 Not implemented error!');
  }
}
