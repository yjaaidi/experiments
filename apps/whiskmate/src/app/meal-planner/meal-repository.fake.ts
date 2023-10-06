import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from '../recipe/recipe';
import { MealRepositoryDef } from './meal-repository.service';

@Injectable({
  providedIn: 'root',
})
export class MealRepositoryFake implements MealRepositoryDef {
  private _meals: Recipe[] = [];

  addMeal(meal: Recipe): Observable<void> {
    this._meals = [...this._meals, meal];
    return of(undefined);
  }

  getMeals(): Observable<Recipe[]> {
    return of(this._meals);
  }

  getMealsSync(): Recipe[] {
    return this._meals;
  }
}
