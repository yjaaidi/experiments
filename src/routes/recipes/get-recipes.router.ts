import { Request, RequestHandler, Response } from 'express';
import { GetRecipes200ResponseDto } from '../../dtos/model/get-recipes200-response-dto';
import { ingredientRepository } from '../../infra/ingredient.repository';
import { recipeRepository } from '../../infra/recipe.repository';
import { toRecipeDto } from '../../infra/to-recipe-dto';

const getRecipesHandler: RequestHandler = (
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
};

export const getRecipesRouter = {
  'get-recipes': getRecipesHandler,
};
