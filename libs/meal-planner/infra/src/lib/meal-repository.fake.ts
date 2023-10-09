import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MealRepositoryDef } from './meal-repository.service';
import { Recipe } from '@whiskmate/recipe-shared/core';

@Injectable({
  providedIn: 'root',
})
export class MealRepositoryFake implements MealRepositoryDef {
  private _meals: Recipe[] = [];

  addMeal(meal: Recipe): Observable<void> {
    this._meals = [...this._meals, meal];
    return of(undefined);
  }

  removeMeal(mealId: string): Observable<void> {
    this._meals = this._meals.filter(({ id }) => id !== mealId);
    return of(undefined);
  }

  getMeals(): Observable<Recipe[]> {
    return of(this._meals);
  }

  getMealsSync(): Recipe[] {
    return this._meals;
  }
}
