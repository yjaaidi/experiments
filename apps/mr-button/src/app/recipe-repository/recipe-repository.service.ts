import { Injectable } from '@angular/core';
import { RecipeRepositoryImpl } from './recipe-repository.impl';
import { RecipeRepositoryPort } from './recipe-repository.port';

@Injectable({
  providedIn: 'root',
  useExisting: RecipeRepositoryImpl,
})
export abstract class RecipeRepository extends RecipeRepositoryPort {}
