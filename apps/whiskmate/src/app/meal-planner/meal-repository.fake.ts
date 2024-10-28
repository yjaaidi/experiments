import { Injectable } from '@angular/core';
import { Recipe } from '../recipe/recipe';
import { MealRepositoryDef } from './meal-repository.service';
import { defer, Observable, of } from 'rxjs';

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
