import { map, Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  private _httpClient = inject(HttpClient);

  search({
    keywords,
    offset = 0,
  }: {
    keywords?: string;
    offset?: number;
  }): Observable<{ items: Recipe[]; total: number }> {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(keywords ? { q: keywords } : {}),
    };

    return this._httpClient
      .get<RecipeListResponseDto>('https://recipe-api.marmicode.io/recipes', {
        params,
      })
      .pipe(
        map((response) => {
          const items = response.items.slice(offset, offset + 5);
          return {
            items: items.map((item) =>
              createRecipe({
                id: item.id,
                name: item.name,
                description: null,
                pictureUri: item.picture_uri,
                ingredients: item.ingredients ?? [],
                steps: [],
              }),
            ),
            total: items.length,
          };
        }),
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
};

interface RecipeListResponseDto {
  items: RecipeDto[];
}

interface RecipeDto {
  id: string;
  created_at: string;
  name: string;
  picture_uri: string;
  ingredients?: IngredientDto[];
}

interface IngredientDto {
  id: string;
  name: string;
}
