import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { createMeal, Meal } from './meal';
import { MealFilter } from './meal-filter';

@Injectable({
  providedIn: 'root',
})
export class MealRepository {

  private _meals: Meal[] = [
    createMeal({
      date: new Date(2021,5,1),
      recipeInfo: {
        id: 'cauliflower',
        name: 'Cauliflower, pomegranate and pistachio salad',
        pictureUri: 'https://ottolenghi.co.uk/media/contentmanager/content/cache/646x458//Cauliflower,-pomegranate-and-pistachio-salad.jpg'
      },
    }),
    createMeal({
      date: new Date(2021,5,2),
      recipeInfo: {
        id: 'braised-eggs',
        name: 'Braised eggs with leek and za’atar',
        pictureUri: 'https://ottolenghi.co.uk/media/contentmanager/content/cache/646x458//Braised-eggs-with-leek-and-za%E2%80%99atar.jpg'
      }
    }),
    createMeal({
      date: new Date(2021,5,3),
      recipeInfo: {
        id: 'buckwheat-hotcakes',
        name: 'Buckwheat and ricotta hotcakes with preserved lemon salsa',
        pictureUri: 'https://ottolenghi.co.uk/media/contentmanager/content/cache/646x458//Buckwheat-and-ricotta-hotcakes-with-preserved-lemon-salsa.jpg'
      }
    }),
    createMeal({
      date: new Date(2021,5,4),
      recipeInfo: {
        id: 'devilled-eggs',
        name: 'Devilled eggs with tangerine rayu',
        pictureUri: 'https://ottolenghi.co.uk/media/contentmanager/content/cache/646x458//Devilled-eggs-with-tangerine-rayu.jpg'
      }
    }),
    createMeal({
      date: new Date(2021,5,5),
      recipeInfo: {
        id: 'stuffed-romano',
        name: 'Stuffed Romano peppers with ricotta and mascarpone',
        pictureUri: 'https://ottolenghi.co.uk/media/contentmanager/content/cache/646x458//Stuffed-Romano-peppers-with-ricotta-and-mascarpone.jpg'
      }
    })
  ]

  getMeals(filter: MealFilter): Observable<Meal[]> {
    return of(this._meals.filter(meal => {
      const start = filter.start?.getTime() ?? 0;
      const end = filter.end?.getTime() ?? Infinity;
      const mealDate = meal.date.getTime();
      return mealDate >= start && mealDate <= end;
    }))
  }
}
