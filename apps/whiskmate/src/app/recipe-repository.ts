import { Observable } from 'rxjs';
import { Recipe } from './recipe';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
  useFactory: () => inject(RecipeRepositoryImpl),
})
export abstract class RecipeRepository {
  abstract search(params?: {
    keywords?: string;
    offset?: number;
  }): Observable<{ items: Recipe[]; total: number }>;
}

@Injectable({
  providedIn: 'root',
})
class RecipeRepositoryImpl implements RecipeRepository {
  search(
    params: {
      keywords?: string;
      offset?: number;
    } = {}
  ): Observable<{ items: Recipe[]; total: number }> {
    throw new Error('Method not implemented.');
  }
}
