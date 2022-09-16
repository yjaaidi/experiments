import type { APIRequestContext, APIResponse } from '@playwright/test';
import { expect, test } from '@playwright/test';

import type { GetRecipes200ResponseItemsInner } from './dtos/model/get-recipes200-response-items-inner';
import type { PostRecipesRequest } from './dtos/model/post-recipes-request';
import type { Recipe } from './dtos/model/recipe';

// test('should remove an ingredient', async ({ request }) => {
//   const client = new RecipeClient(request);

//   let burgerResponse = await client.createBurger();

//   const tomatoes = burgerResponse.data.ingredients![3];

//   const deleteResponse = await client.deleteIngredient(tomatoes.id);

//   burgerResponse = await client.getRecipe(burgerResponse.data.id);

//   expect(deleteResponse.status).toEqual(204);
//   expect(burgerResponse.status).toEqual(200);
//   expect(burgerResponse.data.ingredients?.length).toEqual(3);
//   expect(burgerResponse.data.ingredients).not.toEqual(
//     expect.arrayContaining([expect.objectContaining({ name: 'Tomato' })])
//   );
// });

/*
 * This is the (Domain-Specific Language) DSL.
 */

class RecipeClient {
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
