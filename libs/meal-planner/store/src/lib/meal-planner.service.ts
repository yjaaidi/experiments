import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  merge,
  mergeMap,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Recipe } from '@whiskmate/recipe-shared/core';
import { MealRepository } from '@whiskmate/libs/meal-planner/infra';

@Injectable({
  providedIn: 'root',
})
export class MealPlanner {
  recipes$: Observable<Recipe[]>;

  private _mealRepository = inject(MealRepository);
  private _recipes$ = new BehaviorSubject<Recipe[]>([]);
  private _addMeal$ = new Subject<Recipe>();
  private _removeMeal$ = new Subject<string>();

  constructor() {
    this.recipes$ = this._recipes$.asObservable();

    const effects = [
      /* Fetch meals from repository. */
      this._mealRepository
        .getMeals()
        .pipe(tap((recipes) => this._recipes$.next(recipes))),
      /* Add meals to repository. */
      this._addMeal$.pipe(
        mergeMap((recipe) =>
          this._mealRepository
            .addMeal(recipe)
            .pipe(
              tap(() => this._recipes$.next([...this._recipes$.value, recipe]))
            )
        )
      ),
      /* Remove meals from repository. */
      this._removeMeal$.pipe(
        mergeMap((recipeId) =>
          this._mealRepository
            .removeMeal(recipeId)
            .pipe(
              tap(() =>
                this._recipes$.next(
                  this._recipes$.value.filter(({ id }) => id !== recipeId)
                )
              )
            )
        )
      ),
    ];

    merge(...effects)
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  addRecipe(recipe: Recipe) {
    if (!this._canAddRecipe({ recipe, recipes: this._recipes$.value })) {
      throw new Error(`Can't add recipe.`);
    }
    this._addMeal$.next(recipe);
  }

  watchCanAddRecipe(recipe: Recipe): Observable<boolean> {
    return this._recipes$.pipe(
      map((recipes) => this._canAddRecipe({ recipe, recipes })),
      distinctUntilChanged()
    );
  }

  removeMeal(recipeId: string) {
    this._removeMeal$.next(recipeId);
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
