import { TestBed } from '@angular/core/testing';
import { MealPlanner } from './meal-planner.service';
import { createObserver } from './testing/observer';
import { recipeMother } from './testing/recipe.mother';
import { describe, it, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { NgZone, ɵNoopNgZone } from '@angular/core';

describe(MealPlanner.name, () => {
  const { observe } = createObserver();

  it('should emit an empty array initially', () => {
    const { mealPlanner } = createMealPlanner();

    const observer = observe(mealPlanner.recipes$);

    expect(observer.next).toBeCalledTimes(1);
    expect(observer.next).toBeCalledWith([]);
  });

  it('should watch recipes changes', () => {
    const { beer, burger, mealPlanner } = createMealPlanner();

    const observer = observe(mealPlanner.recipes$);

    /* Restart call history. */
    observer.mockClear();

    mealPlanner.addRecipe(burger);
    mealPlanner.addRecipe(beer);

    expect(observer.next).toBeCalledTimes(2);
    expect(observer.next).toHaveBeenNthCalledWith(1, [
      expect.objectContaining({ name: 'Burger' }),
    ]);
    expect(observer.next).toHaveBeenNthCalledWith(2, [
      expect.objectContaining({ name: 'Burger' }),
      expect.objectContaining({ name: 'Beer' }),
    ]);
  });

  it(`should tell that we can add a recipe if it wasn't added yet`, async () => {
    const { burger, mealPlanner } = createMealPlanner();

    const canAddRecipe = await firstValueFrom(
      mealPlanner.watchCanAddRecipe(burger)
    );

    expect(canAddRecipe).toBe(true);
  });

  it(`should tell that we can't add a recipe if it was already added`, async () => {
    const { mealPlanner } = createMealPlannerWithBurger();

    /* Make sure it's not comparing by reference. */
    const anotherBurger = recipeMother.withBasicInfo('Burger').build();

    const canAddRecipe = await firstValueFrom(
      mealPlanner.watchCanAddRecipe(anotherBurger)
    );

    expect(canAddRecipe).toBe(false);
  });

  it(`should not trigger observable if result didn't change`, () => {
    const { beer, burger, mealPlanner } = createMealPlanner();

    const observer = observe(mealPlanner.watchCanAddRecipe(burger));

    mealPlanner.addRecipe(beer);

    expect(observer.next).toBeCalledTimes(1);
  });

  it('should throw error if recipe is already present', () => {
    const { burger, mealPlanner } = createMealPlannerWithBurger();
    expect(() => mealPlanner.addRecipe(burger)).toThrowError(
      `Can't add recipe.`
    );
  });

  function createMealPlannerWithBurger() {
    const { burger, mealPlanner, ...rest } = createMealPlanner();
    mealPlanner.addRecipe(burger);
    return {
      burger,
      mealPlanner,
      ...rest,
    };
  }

  function createMealPlanner() {
    TestBed.configureTestingModule({
      providers: [{ provide: NgZone, useClass: ɵNoopNgZone }],
    });
    return {
      burger: recipeMother.withBasicInfo('Burger').build(),
      beer: recipeMother.withBasicInfo('Beer').build(),
      mealPlanner: TestBed.inject(MealPlanner),
    };
  }
});
