import { expect, test } from '@playwright/test';
import { RecipeClient } from './testing/recipe-client';

test('should remove an ingredient', async ({ request }) => {
  const client = new RecipeClient(request);

  let burgerResponse = await client.createBurger();

  const tomatoes = burgerResponse.data.ingredients![3];

  const deleteResponse = await client.deleteIngredient(tomatoes.id);

  burgerResponse = await client.getRecipe(burgerResponse.data.id);

  expect(deleteResponse.status).toEqual(204);
  expect(burgerResponse.status).toEqual(200);
  expect(burgerResponse.data.ingredients?.length).toEqual(3);
  expect(burgerResponse.data.ingredients).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'Tomato' })])
  );
});
