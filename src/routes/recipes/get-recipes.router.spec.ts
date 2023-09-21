import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { openapiSpecPath } from '../../infra/openapi-spec';
import { createApp } from '../../start-service';
import { getRecipesRouter } from './get-recipes.router';
import { recipeRepository } from '../../infra/recipe.repository';

describe('GET /recipes', () => {
  it('should filter recipes by keyword', async () => {
    const { client } = setUp();

    recipeRepository.addRecipe({
      name: 'Raclette',
      type: 'plat',
      pictureUri: null,
    });

    recipeRepository.addRecipe({
      name: 'Pizza',
      type: 'plat',
      pictureUri: null,
    });

    const response = await client.get('/recipes').query({ q: 'pizz' });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      items: [
        expect.objectContaining({
          name: 'Pizza',
        }),
      ],
    });
  });

  function setUp() {
    const app = createApp({
      spec: openapiSpecPath,
      handlers: getRecipesRouter,
    });
    return {
      client: supertest(app),
    };
  }
});
