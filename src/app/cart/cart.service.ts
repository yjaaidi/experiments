import { computed, Injectable, Signal, signal } from '@angular/core';
import { Recipe } from '../recipe/recipe';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  recipes: Signal<Recipe[]>;
  count = computed(() => this.recipes().length);

  private _recipes = signal<Recipe[]>([]);

  constructor() {
    this.recipes = this._recipes.asReadonly();
  }

  addRecipe(recipe: Recipe) {
    this._recipes.update((recipes) => [...recipes, recipe]);
  }

  canAdd(recipe: Recipe) {
    return !this.recipes().some((r) => r.id === recipe.id);
  }
}
