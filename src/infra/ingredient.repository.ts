import { generateId } from './generate-id';

export interface Ingredient {
  id: string;
  name: string;
}

class IngredientRepository {
  private _ingredients: (Ingredient & { recipeId: string })[] = [];

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
}

export const ingredientRepository = new IngredientRepository();
