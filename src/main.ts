import { Request, RequestHandler, Response } from 'express';
import { join } from 'path';
import { GetRecipes200ResponseDto } from './dtos/model/get-recipes200-response-dto';
import { GetRecipes200ResponseItemsInnerDto } from './dtos/model/get-recipes200-response-items-inner-dto';
import { GetRecipes4XXResponseDto } from './dtos/model/get-recipes4-xx-response-dto';
import { IngredientDto } from './dtos/model/ingredient-dto';
import { PostRecipesRequestDto } from './dtos/model/post-recipes-request-dto';
import { RecipeDto } from './dtos/model/recipe-dto';
import {
  Ingredient,
  ingredientRepository,
} from './infra/ingredient.repository';
import {
  Recipe,
  RecipeNotFoundError,
  recipeRepository,
} from './infra/recipe.repository';
import { startService } from './start-service';

export const postRecipes: RequestHandler = (
  req,
  res: Response<GetRecipes200ResponseItemsInnerDto>
) => {
  const body = req.body as PostRecipesRequestDto;

  const recipe = recipeRepository.addRecipe({
    name: body.name,
    pictureUri: body.picture_uri ?? null,
    type: body.type,
  });

  const ingredients = body.ingredients?.map((ingredient) => {
    const ingredientData =
      typeof ingredient === 'string' ? { name: ingredient } : ingredient;
    return ingredientRepository.addIngredient({
      recipeId: recipe.id,
      ...ingredientData,
    });
  });

  res.status(201).send({
    ...toRecipeDto(recipe),
    ingredients: ingredients?.map(toIngredientDto),
  });
};

function toRecipeDto(recipe: Recipe): RecipeDto {
  return {
    id: recipe.id,
    created_at: recipe.createdAt.toISOString(),
    name: recipe.name,
    picture_uri: recipe.pictureUri ?? null,
  };
}

function toIngredientDto(ingredient: Ingredient): IngredientDto {
  return {
    id: ingredient.id,
    name: ingredient.name,
  };
}

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

      const keywords = req.query['q'] as string | undefined;

      res.send({
        items: recipeRepository.searchRecipes(keywords).map((recipe) => {
          const recipeDto = toRecipeDto(recipe);

          if (shouldEmbedIngredients) {
            return {
              ...recipeDto,
              ingredients: ingredientRepository.getRecipeIngredients(recipe.id),
            };
          }

          return recipeDto;
        }),
      });
    },
    'get-recipe': (req, res) => {
      try {
        const recipeId = req.params.recipe_id;
        res.status(200).send({
          ...toRecipeDto(recipeRepository.getRecipe(recipeId)),
          ingredients: ingredientRepository.getRecipeIngredients(recipeId),
        });
      } catch (e) {
        if (e instanceof RecipeNotFoundError) {
          res.status(404).send(createResourceNotFoundError('recipe'));
          return;
        }
        throw e;
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

function createResourceNotFoundError(resourceType: string) {
  return {
    type: 'https://errors.marmicode.io/resource-not-found',
    title: 'Resource Not found',
    resource_type: resourceType,
  };
}
