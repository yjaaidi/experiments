import { expect, test } from '@playwright/test';
import { RecipeClient } from './testing/recipe-client';

test('should get all recipes', async ({ request }) => {
  const client = new RecipeClient(request);

  const response = await client.getRecipes();

  expect(response.status).toEqual(200);
  /* There are salads. */
  expect(response.data.items).toContainEqual(
    expect.objectContaining({
      name: 'Salad',
    })
  );
});

test('should filter recipes by keywords', async ({ request }) => {
  const client = new RecipeClient(request);

  const response = await client.getRecipes({ q: 'burger' });

  expect(response.status).toEqual(200);
  /* There are burgers. */
  expect(response.data.items).toContainEqual(
    expect.objectContaining({
      name: 'Burger',
    })
  );
  /* There are no salads. */
  expect(response.data.items).not.toContainEqual(
    expect.objectContaining({
      name: 'Salad',
    })
  );
});
