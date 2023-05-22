import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeRepository {
  searchRecipes() {
    return of(['Burger', 'Pizza', 'Pasta', 'Salad']);
  }
}
