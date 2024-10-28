import { Observable } from 'rxjs';
import { Recipe } from '@whiskmate/recipe-shared/core';

export interface MealRepositoryDef {
  getMeals(): Observable<Recipe[]>;

  addMeal(recipe: Recipe): Promise<void>;

  removeMeal(mealId: string): Promise<void>;
}
