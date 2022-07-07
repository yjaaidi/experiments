import {
  test,
  expect,
  request,
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

test('should remove an ingredient', async ({ request }) => {
  const client = new RecipeClient(request);

  let burgerResponse = await client.createBurger();

  const tomatoes = burgerResponse.data.ingredients[3];

  const deleteResponse = await client.deleteIngredient(tomatoes.id);

  burgerResponse = await client.getRecipe(burgerResponse.data.id);

  expect(deleteResponse.status).toEqual(204);
  expect(burgerResponse.status).toEqual(200);
  expect(burgerResponse.data.ingredients.length).toEqual(3);
  expect(burgerResponse.data.ingredients).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'Tomato' })])
  );
});

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

  async createRecipe(recipeNew: RecipeNew) {
    const response = await this._context.post('/recipes', { data: recipeNew });
    return await this._responseToSimpleResponse<Recipe>(response);
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

/*
 * This should be generated by OpenAPI generator.
 */

interface RecipeNew {
  name: string;
  type: 'entree' | 'plat' | 'dessert';
  ingredients?: string[] | IngredientNew[];
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

interface IngredientNew {
  name: string;
}

interface Ingredient extends IngredientNew {
  id: string;
}
