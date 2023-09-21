import { RequestHandler, Response } from 'express';
import { GetRecipes200ResponseItemsInnerDto } from '../../dtos/model/get-recipes200-response-items-inner-dto';
import { PostRecipesRequestDto } from '../../dtos/model/post-recipes-request-dto';
import { ingredientRepository } from '../../infra/ingredient.repository';
import { recipeRepository } from '../../infra/recipe.repository';
import { toIngredientDto } from '../../infra/to-ingredient-dto';
import { toRecipeDto } from '../../infra/to-recipe-dto';

const postRecipesHander: RequestHandler = (
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

export const postRecipesRouter = { 'post-recipes': postRecipesHander };
