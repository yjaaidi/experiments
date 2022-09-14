import { join } from 'path';
import { startService } from './start-service';

let recipes: any[] = [];
let ingredients: any[] = [];

startService({
  spec: join(__dirname, 'recipes.openapi.yaml'),
  handlers: {
    'post-recipes': (req, res) => {
      const recipe = {
        id: generateId('rec'),
        created_at: new Date().toISOString(),
        ...req.body,
      };
      recipes.push(recipe);
      res.status(201).send(recipe);
    },
    'get-recipes': (req, res) => {
      const shouldEmbedIngredients = (req.query['embed'] as string)
        ?.split(',')
        .includes('ingredients');

      /* Embed recipe ingredients. */
      const items = shouldEmbedIngredients
        ? recipes.map((recipe) => embedRecipeIngredients(recipe))
        : recipes;

      res.send({ items });
    },
    'get-recipe': (req, res) => {
      const recipe = recipes.find(
        (recipe) => recipe.id === req.params.recipe_id
      );

      if (recipe != null) {
        res.status(200).send(embedRecipeIngredients(recipe));
      } else {
        res.status(404).send(createResourceNotFoundError('recipe'));
      }
    },
    'post-ingredient': (req, res) => {
      const ingredient = {
        id: generateId('ing'),
        recipe_id: req.params.recipe_id,
        ...req.body,
      };
      ingredients.push(ingredient);
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

function toIngredientDto(ingredient: any) {
  return {
    id: ingredient.id,
    name: ingredient.name,
  };
}

function embedRecipeIngredients(recipe: any) {
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

let index = 0;
function generateId(prefix: string) {
  return `${prefix}_${index++}`;
}
