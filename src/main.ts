import { Request, RequestHandler, Response } from 'express';
import { join } from 'path';
import { GetRecipes200ResponseDto } from './dtos/model/get-recipes200-response-dto';
import { GetRecipes4XXResponseDto } from './dtos/model/get-recipes4-xx-response-dto';
import { IngredientDto } from './dtos/model/ingredient-dto';
import { IngredientNewDto } from './dtos/model/ingredient-new-dto';
import { PostRecipesRequestDto } from './dtos/model/post-recipes-request-dto';
import { RecipeDto } from './dtos/model/recipe-dto';
import { generateId } from './infra/generate-id';
import { startService } from './start-service';

let recipes: RecipeDto[] = [
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
let ingredients: (IngredientDto & { recipe_id: string })[] = [
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

export const postRecipes: RequestHandler = (req, res: Response<RecipeDto>) => {
  const body = req.body as PostRecipesRequestDto;
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
      res: Response<GetRecipes200ResponseDto>
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
    'get-recipe': (
      req,
      res: Response<RecipeDto | GetRecipes4XXResponseDto>
    ) => {
      const recipe = recipes.find(
        (recipe) => recipe.id === req.params.recipe_id
      );

      if (recipe != null) {
        res.status(200).send(embedRecipeIngredients(recipe));
      } else {
        res.status(404).send(createResourceNotFoundError('recipe'));
      }
    },
    'post-ingredient': (req, res: Response<IngredientDto>) => {
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

function toIngredientDto(ingredient: IngredientDto) {
  return {
    id: ingredient.id,
    name: ingredient.name,
  };
}

function embedRecipeIngredients(recipe: RecipeDto) {
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
  ingredients?: (string | IngredientNewDto)[];
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
  ingredient: IngredientNewDto;
}) {
  const newIngredient = {
    id: generateId('ing'),
    recipe_id: recipeId,
    ...ingredient,
  };
  ingredients.push(newIngredient);
  return newIngredient;
}
