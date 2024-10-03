import { APIRequestContext, APIResponse } from '@playwright/test';
import { GetRecipes200ResponseDto } from '../../src/dtos/model/get-recipes200-response-dto';
import { GetRecipes200ResponseItemsInnerDto } from '../../src/dtos/model/get-recipes200-response-items-inner-dto';
import { RecipeDto } from '../../src/dtos/model/recipe-dto';
import { PostRecipesRequestDto } from '../../src/dtos/model/post-recipes-request-dto';

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

  async createRecipe(recipeNew: PostRecipesRequestDto) {
    const response = await this._context.post('/recipes', { data: recipeNew });
    return await this._responseToSimpleResponse<GetRecipes200ResponseItemsInnerDto>(
      response
    );
  }

  async getRecipe(recipeId: string) {
    const response = await this._context.get(`/recipes/${recipeId}`);
    return await this._responseToSimpleResponse<RecipeDto>(response);
  }

  async getRecipes({ q }: { q?: string } = {}) {
    const params = q ? { q } : undefined;
    const response = await this._context.get(`/recipes`, { params });
    return await this._responseToSimpleResponse<GetRecipes200ResponseDto>(
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
