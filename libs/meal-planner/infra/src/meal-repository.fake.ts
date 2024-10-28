import { Injectable, Provider } from '@angular/core';
import { Recipe } from '@whiskmate/recipe-shared/core';
import { defer, Observable, of } from 'rxjs';
import { MealRepositoryDef } from '@whiskmate/meal-planner/core';
import { MealRepository } from './meal-repository.service';

@Injectable({
  providedIn: 'root',
})
export class MealRepositoryFake implements MealRepositoryDef {
  private _meals: Recipe[] = [];

  getMeals(): Observable<Recipe[]> {
    return defer(() => of(this.getMealsSync()));
  }

  async addMeal(meal: Recipe): Promise<void> {
    this._meals = [...this._meals, meal];
  }

  async removeMeal(mealId: string): Promise<void> {
    this._meals = this._meals.filter(({ id }) => id !== mealId);
  }

  getMealsSync(): Recipe[] {
    return this._meals;
  }
}

export function provideMealRepositoryFake(): Provider[] {
  return [
    MealRepositoryFake,
    { provide: MealRepository, useExisting: MealRepositoryFake },
  ];
}
