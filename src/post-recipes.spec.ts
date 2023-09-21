import { join } from 'path';
import supertest from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { PostRecipesRequestDto } from './dtos/model/post-recipes-request-dto';
import { postRecipes } from './main';
import { createApp } from './start-service';

vi.useFakeTimers({
  now: new Date('2023-09-01T10:00:00Z'),
});

describe(postRecipes.name, () => {
  it('should create recipes', async () => {
    const { client } = setUp();

    const response = await client.post('/recipes').send({
      name: 'Burger',
      picture_uri:
        'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg',
      type: 'plat',
    } as PostRecipesRequestDto);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toMatchObject({
      id: expect.stringMatching(/^rec_\d+/),
      created_at: '2023-09-01T10:00:00.000Z',
      name: 'Burger',
      picture_uri:
        'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg',
    });
  });

  it('should create recipe with ingredients', async () => {
    const { client } = setUp();

    const response = await client.post('/recipes').send({
      name: 'Burger',
      type: 'plat',
      ingredients: ['🥯 Bun', '🍅 Tomatoes', '🧀 Cheese', '🥩 Meat'],
    } as PostRecipesRequestDto);

    expect(response.statusCode).toEqual(201);
    expect(response.body.ingredients).toContainEqual({
      id: expect.any(String),
      name: '🥯 Bun',
    });
  });

  function setUp() {
    const app = createApp({
      spec: join(__dirname, 'recipes.openapi.yaml'),
      handlers: { 'post-recipes': postRecipes },
    });
    return {
      client: supertest(app),
    };
  }
});
