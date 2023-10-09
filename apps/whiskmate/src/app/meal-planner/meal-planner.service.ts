import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Recipe } from '../recipe/recipe';
import { MealRepository } from './meal-repository.service';

@Injectable({
  providedIn: 'root',
})
export class MealPlanner implements OnDestroy {
  recipes$: Observable<Recipe[]>;

  private _mealRepository = inject(MealRepository);
  private _recipes$ = new BehaviorSubject<Recipe[]>([]);
  private _subscription = new Subscription();

  constructor() {
    this.recipes$ = this._recipes$.asObservable();
    this._subscription.add(
      this._mealRepository
        .getMeals()
        .subscribe((recipes) => this._recipes$.next(recipes))
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  addRecipe(recipe: Recipe) {
    if (!this._canAddRecipe({ recipe, recipes: this._recipes$.value })) {
      throw new Error(`Can't add recipe.`);
    }

    this._subscription.add(this._mealRepository.addMeal(recipe).subscribe());

    this._recipes$.next([...this._recipes$.value, recipe]);
  }

  watchCanAddRecipe(recipe: Recipe): Observable<boolean> {
    return this._recipes$.pipe(
      map((recipes) => this._canAddRecipe({ recipe, recipes })),
      distinctUntilChanged()
    );
  }

  removeMeal(recipeId: string) {
    this._recipes$.next(
      this._recipes$.value.filter(({ id }) => id !== recipeId)
    );
  }

  private _canAddRecipe({
    recipes,
    recipe,
  }: {
    recipes: Recipe[];
    recipe: Recipe;
  }) {
    return !recipes.find((_recipe) => _recipe.id === recipe.id);
  }
}
