import { Request, RequestHandler, Response } from 'express';
import { join } from 'path';
import { GetRecipes200Response } from './dtos/model/get-recipes200-response';
import { GetRecipes4XXResponse } from './dtos/model/get-recipes4-xx-response';
import { Ingredient } from './dtos/model/ingredient';
import { IngredientNew } from './dtos/model/ingredient-new';
import { PostRecipesRequest } from './dtos/model/post-recipes-request';
import { Recipe } from './dtos/model/recipe';
import { startService } from './start-service';

let recipes: Recipe[] = [
  {
    id: 'rec-burger',
    created_at: new Date().toISOString(),
    name: 'Burger',
    picture_uri:
      'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg',
  },
  {
    id: 'rec-salad',
    created_at: new Date().toISOString(),
    name: 'Salad',
    picture_uri:
      'https://www.ninkasi.fr/wp-content/uploads/2022/10/lyonnaise.png',
  },
];
let ingredients: (Ingredient & { recipe_id: string })[] = [
  {
    id: 'ing-burger-bun',
    name: 'Burger bun',
    recipe_id: 'rec-burger',
  },
  {
    id: 'ing-burger-tomatoes',
    name: 'Tomatoes',
    recipe_id: 'rec-burger',
  },
  {
    id: 'ing-burger-cheese',
    name: 'Cheese',
    recipe_id: 'rec-burger',
  },
  {
    id: 'ing-burger-meat',
    name: 'Meat',
    recipe_id: 'rec-burger',
  },
  {
    id: 'ing-salad-lettuce',
    name: 'Lettuce',
    recipe_id: 'rec-salad',
  },
  {
    id: 'ing-salad-eggs',
    name: 'Eggs',
    recipe_id: 'rec-salad',
  },
];

export const postRecipes: RequestHandler = (req, res: Response<Recipe>) => {
  const body = req.body as PostRecipesRequest;
  const recipeId = generateId('rec');
  const recipe = {
    id: recipeId,
    created_at: new Date().toISOString(),
    name: body.name,
    picture_uri: body.picture_uri ?? null,
    type: body.type,
    ingredients: addIngredients({
      recipeId,
      ingredients: body.ingredients,
    }),
  };
  recipes.push(recipe);
  res.status(201).send(recipe);
};

startService({
  spec: join(__dirname, 'recipes.openapi.yaml'),
  handlers: {
    'post-recipes': postRecipes,
    'get-recipes': (
      req: Request<unknown>,
      res: Response<GetRecipes200Response>
    ) => {
      const shouldEmbedIngredients = (req.query['embed'] as string)
        ?.split(',')
        .includes('ingredients');

      /* Embed recipe ingredients. */
      const items = shouldEmbedIngredients
        ? recipes.map((recipe) => embedRecipeIngredients(recipe))
        : recipes;

      const keywords = req.query['q'] as string | undefined;
      const filteredItems = keywords
        ? items.filter((item) => item.name?.toLowerCase().includes(keywords))
        : items;

      res.send({ items: filteredItems });
    },
    'get-recipe': (req, res: Response<Recipe | GetRecipes4XXResponse>) => {
      const recipe = recipes.find(
        (recipe) => recipe.id === req.params.recipe_id
      );

      if (recipe != null) {
        res.status(200).send(embedRecipeIngredients(recipe));
      } else {
        res.status(404).send(createResourceNotFoundError('recipe'));
      }
    },
    'post-ingredient': (req, res: Response<Ingredient>) => {
      const ingredient = addIngredient({
        recipeId: req.params.recipe_id,
        ingredient: req.body,
      });
      res.status(201).send(ingredient);
    },
    'delete-ingredient': (req, res) => {
      ingredients = ingredients.filter(
        (ingredient) => ingredient.id != req.params.ingredient_id
      );
      res.sendStatus(204);
    },
  },
});

function toIngredientDto(ingredient: Ingredient) {
  return {
    id: ingredient.id,
    name: ingredient.name,
  };
}

function embedRecipeIngredients(recipe: Recipe) {
  return {
    ...recipe,
    ingredients: ingredients
      .filter((ingredient) => ingredient.recipe_id === recipe.id)
      .map((ingredient) => toIngredientDto(ingredient)),
  };
}

function createResourceNotFoundError(resourceType: string) {
  return {
    type: 'https://errors.marmicode.io/resource-not-found',
    title: 'Resource Not found',
    resource_type: resourceType,
  };
}

function addIngredients({
  recipeId,
  ingredients,
}: {
  recipeId: string;
  ingredients?: (string | IngredientNew)[];
}) {
  return ingredients?.map((ingredient) => {
    const newIngredient =
      typeof ingredient === 'string' ? { name: ingredient } : ingredient;
    return addIngredient({ recipeId, ingredient: newIngredient });
  });
}

function addIngredient({
  recipeId,
  ingredient,
}: {
  recipeId: string;
  ingredient: IngredientNew;
}) {
  const newIngredient = {
    id: generateId('ing'),
    recipe_id: recipeId,
    ...ingredient,
  };
  ingredients.push(newIngredient);
  return newIngredient;
}

let index = 0;
function generateId(prefix: string) {
  return `${prefix}_${index++}`;
}
