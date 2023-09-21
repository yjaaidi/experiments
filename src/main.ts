import { Request, Response } from 'express';
import { join } from 'path';
import { GetRecipes200ResponseDto } from './dtos/model/get-recipes200-response-dto';
import { IngredientDto } from './dtos/model/ingredient-dto';
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
import { postRecipesRouter } from './routes/post-recipes.router';
import { startService } from './start-service';

export function toRecipeDto(recipe: Recipe): RecipeDto {
  return {
    id: recipe.id,
    created_at: recipe.createdAt.toISOString(),
    name: recipe.name,
    picture_uri: recipe.pictureUri ?? null,
  };
}

export function toIngredientDto(ingredient: Ingredient): IngredientDto {
  return {
    id: ingredient.id,
    name: ingredient.name,
  };
}

startService({
  spec: join(__dirname, 'recipes.openapi.yaml'),
  handlers: {
    ...postRecipesRouter,
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
