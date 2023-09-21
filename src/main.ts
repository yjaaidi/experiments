import { Request, RequestHandler, Response } from 'express';
import { join } from 'path';
import { GetRecipes200ResponseDto } from './dtos/model/get-recipes200-response-dto';
import { GetRecipes4XXResponseDto } from './dtos/model/get-recipes4-xx-response-dto';
import { IngredientDto } from './dtos/model/ingredient-dto';
import { PostRecipesRequestDto } from './dtos/model/post-recipes-request-dto';
import { RecipeDto } from './dtos/model/recipe-dto';
import { generateId } from './infra/generate-id';
import { ingredientRepository } from './infra/ingredient.repository';
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

export const postRecipes: RequestHandler = (req, res: Response<RecipeDto>) => {
  const body = req.body as PostRecipesRequestDto;

  const recipeId = generateId('rec');

  const ingredients = body.ingredients?.map((ingredient) => {
    const ingredientData =
      typeof ingredient === 'string' ? { name: ingredient } : ingredient;
    return ingredientRepository.addIngredient({ recipeId, ...ingredientData });
  });

  const recipe = {
    id: recipeId,
    created_at: new Date().toISOString(),
    name: body.name,
    picture_uri: body.picture_uri ?? null,
    type: body.type,
    ingredients,
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
        ? recipes.map((recipe) => ({
            ...recipe,
            ingredients: ingredientRepository.getRecipeIngredients(recipe.id),
          }))
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
        res.status(200).send(recipe);
      } else {
        res.status(404).send(createResourceNotFoundError('recipe'));
      }
    },
    'post-ingredient': (req, res: Response<IngredientDto>) => {
      res.status(201).send(
        ingredientRepository.addIngredient({
          recipeId: req.params.recipe_id,
          ...req.body,
        })
      );
    },
    'delete-ingredient': (req, res) => {
      ingredientRepository.removeIngredient(req.params.ingredient_id);
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

function createResourceNotFoundError(resourceType: string) {
  return {
    type: 'https://errors.marmicode.io/resource-not-found',
    title: 'Resource Not found',
    resource_type: resourceType,
  };
}
