import { Response } from 'express';
import { join } from 'path';
import { GetRecipes200Response } from './dtos/model/get-recipes200-response';
import { GetRecipes4XXResponse } from './dtos/model/get-recipes4-xx-response';
import { Ingredient } from './dtos/model/ingredient';
import { IngredientNew } from './dtos/model/ingredient-new';
import { PostRecipesRequest } from './dtos/model/post-recipes-request';
import { Recipe } from './dtos/model/recipe.js';
import { getDirname, startService } from './start-service.js';

let recipes: Recipe[] = [];
let ingredients: (Ingredient & { recipe_id: string })[] = [];

startService({
  spec: join(getDirname(import.meta.url), 'recipes.openapi.yaml'),
  handlers: {
    'post-recipes': (req, res: Response<Recipe>) => {
      const body = req.body as PostRecipesRequest;
      const recipeId = generateId('rec');
      const recipe = {
        id: recipeId,
        created_at: new Date().toISOString(),
        name: body.name,
        type: body.type,
        ingredients: addIngredients({
          recipeId,
          ingredients: body.ingredients,
        }),
      };
      recipes.push(recipe);
      res.status(201).send(recipe);
    },
    'get-recipes': (req, res: Response<GetRecipes200Response>) => {
      const shouldEmbedIngredients = (req.query['embed'] as string)
        ?.split(',')
        .includes('ingredients');

      /* Embed recipe ingredients. */
      const items = shouldEmbedIngredients
        ? recipes.map((recipe) => embedRecipeIngredients(recipe))
        : recipes;

      res.send({ items });
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
