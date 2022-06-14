import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { createMeal, Meal } from './meal';
import { MealFilter } from './meal-filter';

// @hack use this meanwhile we move pics somewhere else
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;

@Injectable({
  providedIn: 'root',
})
export class MealRepository {
  private _meals: Meal[] = [
    createMeal({
      date: new Date(Date.UTC(2021, 5, 1)),
      recipeInfo: {
        id: 'cauliflower',
        name: 'Cauliflower, pomegranate and pistachio salad',
        pictureUri: require('!!file-loader!./pics/cauliflower.jpg').default,
      },
    }),
    createMeal({
      date: new Date(Date.UTC(2021, 5, 2)),
      recipeInfo: {
        id: 'braised-eggs',
        name: 'Braised eggs with leek and za’atar',
        pictureUri: require('!!file-loader!./pics/braised-eggs.jpg').default,
      },
    }),
    createMeal({
      date: new Date(Date.UTC(2021, 5, 3)),
      recipeInfo: {
        id: 'buckwheat-hotcakes',
        name: 'Buckwheat and ricotta hotcakes with preserved lemon salsa',
        pictureUri: require('!!file-loader!./pics/hotcakes.jpg').default,
      },
    }),
    createMeal({
      date: new Date(Date.UTC(2021, 5, 4)),
      recipeInfo: {
        id: 'devilled-eggs',
        name: 'Devilled eggs with tangerine rayu',
        pictureUri: require('!!file-loader!./pics/eggs.jpg').default,
      },
    }),
    createMeal({
      date: new Date(Date.UTC(2021, 5, 5)),
      recipeInfo: {
        id: 'stuffed-romano',
        name: 'Stuffed Romano peppers with ricotta and mascarpone',
        pictureUri: require('!!file-loader!./pics/peppers.jpg').default,
      },
    }),
  ];

  getMeals(filter: MealFilter): Observable<Meal[]> {
    return of(
      this._meals.filter((meal) => {
        const start = filter.start?.getTime() ?? 0;
        const end = filter.end?.getTime() ?? Infinity;
        const mealDate = meal.date.getTime();
        return mealDate >= start && mealDate <= end;
      })
    );
  }
}
