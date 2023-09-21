import { Request, Response } from 'express';
import { join } from 'path';
import { GetRecipes200ResponseDto } from './dtos/model/get-recipes200-response-dto';
import { IngredientDto } from './dtos/model/ingredient-dto';
import { ingredientRepository } from './infra/ingredient.repository';
import { recipeRepository } from './infra/recipe.repository';
import { toRecipeDto } from './infra/to-recipe-dto';
import { getRecipeRouter } from './routes/get-recipe.router';
import { postRecipesRouter } from './routes/post-recipes.router';
import { startService } from './start-service';

startService({
  spec: join(__dirname, 'recipes.openapi.yaml'),
  handlers: {
    ...postRecipesRouter,
    ...getRecipeRouter,
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
