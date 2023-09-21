import { join } from 'path';
import { getRecipesRouter } from './routes/recipes/get-recipes.router';
import { deleteIngredientRouter } from './routes/ingredients/delete-ingredient.router';
import { postIngredientRouter } from './routes/ingredients/post-ingredient.router';
import { getRecipeRouter } from './routes/recipes/get-recipe.router';
import { postRecipesRouter } from './routes/recipes/post-recipes.router';
import { startService } from './start-service';

startService({
  spec: join(__dirname, 'recipes.openapi.yaml'),
  handlers: {
    ...getRecipeRouter,
    ...postRecipesRouter,
    ...postIngredientRouter,
    ...getRecipesRouter,
    ...deleteIngredientRouter,
  },
});
