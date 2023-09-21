import { RequestHandler } from 'express';
import {
  RecipeNotFoundError,
  recipeRepository,
} from '../../infra/recipe.repository';
import { toRecipeDto } from '../../infra/to-recipe-dto';
import { ingredientRepository } from '../../infra/ingredient.repository';
import { createResourceNotFoundError } from '../../infra/create-resource-not-fund-error';

const getRecipeHandler: RequestHandler = (req, res) => {
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
};

export const getRecipeRouter = {
  'get-recipe': getRecipeHandler,
};
