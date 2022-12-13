import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetRecipes200Response } from '../dtos/model/get-recipes200-response';
import { GetRecipes200ResponseItemsInner } from '../dtos/model/get-recipes200-response-items-inner';
import { Recipe } from '../dtos/model/recipe';
import { PostRecipesRequest } from './../dtos/model/post-recipes-request';

/**
 * This is the (Domain-Specific Language) DSL.
 */
export class RecipeClient {
  constructor(private _context: APIRequestContext) {}

  async createBurger() {
    return await this.createRecipe({
      name: 'Burger',
      type: 'plat',
      ingredients: ['Buns', 'Patty', 'Lettuce', 'Tomato'],
    });
  }

  async createRecipe(recipeNew: PostRecipesRequest) {
    const response = await this._context.post('/recipes', { data: recipeNew });
    return await this._responseToSimpleResponse<GetRecipes200ResponseItemsInner>(
      response
    );
  }

  async getRecipe(recipeId: string) {
    const response = await this._context.get(`/recipes/${recipeId}`);
    return await this._responseToSimpleResponse<Recipe>(response);
  }

  async getRecipes({ q }: { q?: string } = {}) {
    const params = q ? { q } : undefined;
    const response = await this._context.get(`/recipes`, { params });
    return await this._responseToSimpleResponse<GetRecipes200Response>(
      response
    );
  }

  async deleteIngredient(ingredientId: string) {
    const response = await this._context.delete(`/ingredients/${ingredientId}`);
    return { status: response.status() };
  }

  private async _responseToSimpleResponse<T = unknown>(response: APIResponse) {
    return {
      status: response.status(),
      data: (await response.json()) as T,
    };
  }
}
