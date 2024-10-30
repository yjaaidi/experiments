import { TestBed } from '@angular/core/testing';
import { recipeMother } from '../testing/recipe.mother';
import { MealPlanner } from './meal-planner.service';
import { MealRepositoryFake } from './meal-repository.fake';
import { MealRepository } from './meal-repository.service';
import { effect, Injector } from '@angular/core';
import { Recipe } from '../recipe/recipe';

describe(MealPlanner.name, () => {
  const burger = recipeMother.withBasicInfo('Burger').build();
  const salad = recipeMother.withBasicInfo('Salad').build();

  it('should add recipe', async () => {
    const { mealPlanner } = createMealPlanner();

    await mealPlanner.addRecipe(burger);
    await mealPlanner.addRecipe(salad);

    expect(mealPlanner.recipes()).toMatchObject([
      { name: 'Burger' },
      { name: 'Salad' },
    ]);
  });

  it('should throw error if recipe is already present', async () => {
    const { mealPlanner } = await createMealPlannerWithBurger();

    expect(mealPlanner.addRecipe(burger)).rejects.toThrow(`Can't add recipe.`);
  });

  it('should add recipe to meal repository', () => {
    const { mealPlanner, mealRepoFake } = createMealPlanner();

    mealPlanner.addRecipe(burger);

    expect(mealRepoFake.getMealsSync()).toMatchObject([{ name: 'Burger' }]);
  });

  it('should fetch recipes from meal repository', async () => {
    const { getMealPlanner, mealRepoFake } = setUpMealPlanner();

    await mealRepoFake.addMeal(burger);

    const mealPlanner = getMealPlanner();

    expect(mealPlanner.recipes()).toMatchObject([{ name: 'Burger' }]);
  });

  it('should notify consumer when recipes are added', async () => {
    const { mealPlanner, createEffect, flushEffects } = createMealPlanner();

    let recipes: Recipe[] | null = null;
    createEffect(() => {
      recipes = mealPlanner.recipes();
    });

    await mealPlanner.addRecipe(burger);
    await mealPlanner.addRecipe(salad);

    flushEffects();

    expect(recipes).toMatchObject([{ name: 'Burger' }, { name: 'Salad' }]);
  });

  describe('canAddRecipe()', () => {
    it('should tell if recipe can be added', () => {
      const { mealPlanner } = createMealPlanner();

      expect(mealPlanner.canAddRecipe(burger)).toBe(true);
    });

    it(`should notify with false when recipe is added and can't be added anymore`, async () => {
      const { mealPlanner, createEffect, flushEffects } = createMealPlanner();

      let canBeAdded: boolean | null = null;
      createEffect(() => {
        canBeAdded = mealPlanner.canAddRecipe(burger);
      });

      await mealPlanner.addRecipe(burger);

      flushEffects();

      expect(canBeAdded).toBe(false);
    });
  });

  async function createMealPlannerWithBurger() {
    const { mealPlanner, ...rest } = createMealPlanner();

    await mealPlanner.addRecipe(burger);

    return {
      mealPlanner,
      ...rest,
    };
  }

  function createMealPlanner() {
    const { getMealPlanner, ...utils } = setUpMealPlanner();

    return {
      mealPlanner: getMealPlanner(),
      ...utils,
    };
  }

  function setUpMealPlanner() {
    const mealRepoFake = new MealRepositoryFake();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MealRepository,
          useValue: mealRepoFake,
        },
      ],
    });

    return {
      createEffect(fn: () => void) {
        effect(fn, { injector: TestBed.inject(Injector) });
      },
      flushEffects() {
        TestBed.flushEffects();
      },
      getMealPlanner() {
        return TestBed.inject(MealPlanner);
      },
      mealRepoFake,
    };
  }
});
