import { generateId } from './generate-id';

export interface Ingredient {
  id: string;
  name: string;
}

class IngredientRepository {
  private _ingredients: (Ingredient & { recipeId: string })[] = [
    {
      id: 'ing-burger-bun',
      name: 'Burger bun',
      recipeId: 'rec-burger',
    },
    {
      id: 'ing-burger-tomatoes',
      name: 'Tomatoes',
      recipeId: 'rec-burger',
    },
    {
      id: 'ing-burger-cheese',
      name: 'Cheese',
      recipeId: 'rec-burger',
    },
    {
      id: 'ing-burger-meat',
      name: 'Meat',
      recipeId: 'rec-burger',
    },
    {
      id: 'ing-salad-lettuce',
      name: 'Lettuce',
      recipeId: 'rec-salad',
    },
    {
      id: 'ing-salad-eggs',
      name: 'Eggs',
      recipeId: 'rec-salad',
    },
  ];

  addIngredient({ name, recipeId }: { name: string; recipeId: string }) {
    const ingredient = {
      id: generateId('ing'),
      name,
    };

    this._ingredients.push({ ...ingredient, recipeId });

    return ingredient;
  }

  getRecipeIngredients(recipeId: string) {
    return this._ingredients
      .filter((ingredient) => ingredient.recipeId === recipeId)
      .map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
      }));
  }

  removeIngredient(ingredientId: string) {
    this._ingredients = this._ingredients.filter(
      (ingredient) => ingredient.id != ingredientId
    );
  }
}

export const ingredientRepository = new IngredientRepository();
