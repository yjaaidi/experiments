import { inject, Injectable } from '@angular/core';
import { Recipe } from '../recipe/recipe';
import { LocalStorage } from '../shared/local-storage';
import { defer, Observable, of } from 'rxjs';

export interface MealRepositoryDef {
  getMeals(): Observable<Recipe[]>;

  addMeal(recipe: Recipe): Promise<void>;

  removeMeal(mealId: string): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class MealRepository implements MealRepositoryDef {
  private _localStorage = inject(LocalStorage);
  private _meals: Recipe[] = [];

  constructor() {
    this._meals = this._loadMeals();
  }

  getMeals(): Observable<Recipe[]> {
    return defer(() => of(this._meals));
  }

  async addMeal(meal: Recipe): Promise<void> {
    this._updateMeals([...this._meals, meal]);
  }

  async removeMeal(mealId: string): Promise<void> {
    this._updateMeals(this._meals.filter(({ id }) => id !== mealId));
  }

  private _loadMeals(): Recipe[] {
    const rawValue = this._localStorage.getItem(LOCAL_STORAGE_KEY);

    if (rawValue == null) {
      return [];
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return [];
    }
  }

  private _updateMeals(meals: Recipe[]) {
    this._meals = meals;
    this._localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meals));
  }
}

const LOCAL_STORAGE_KEY = 'meals';
