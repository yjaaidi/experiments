import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { createObserver } from '../testing/observer';
import { recipeMother } from '../testing/recipe.mother';
import { MealPlanner } from './meal-planner.service';
import { MealRepositoryFake } from './meal-repository.fake';
import { MealRepository } from './meal-repository.service';

describe(MealPlanner.name, () => {
  const { observe } = createObserver();
  const burger = recipeMother.withBasicInfo('Burger').build();
  const salad = recipeMother.withBasicInfo('Salad').build();

  it('should add recipe', async () => {
    const { mealPlanner } = createMealPlanner();

    await mealPlanner.addRecipe(burger);
    await mealPlanner.addRecipe(salad);

    expect(await firstValueFrom(mealPlanner.recipes$)).toEqual([
      expect.objectContaining({ name: 'Burger' }),
      expect.objectContaining({ name: 'Salad' }),
    ]);
  });

  it('should throw error if recipe is already present', () => {
    const { mealPlanner } = createMealPlannerWithBurger();

    expect(mealPlanner.addRecipe(burger)).rejects.toThrow(`Can't add recipe.`);
  });

  it('should add recipe to meal repository', () => {
    const { mealPlanner, mealRepoFake } = createMealPlanner();

    mealPlanner.addRecipe(burger);

    expect(mealRepoFake.getMealsSync()).toEqual([
      expect.objectContaining({ name: 'Burger' }),
    ]);
  });

  it('should fetch recipes from meal repository', async () => {
    const { getMealPlanner, mealRepoFake } = setUpMealPlanner();

    await mealRepoFake.addMeal(burger);

    const mealPlanner = getMealPlanner();

    expect(await firstValueFrom(mealPlanner.recipes$)).toEqual([
      expect.objectContaining({ name: 'Burger' }),
    ]);
  });

  describe('recipes$', () => {
    it('should emit empty array when no recipes', async () => {
      const { mealPlanner } = createMealPlanner();

      const observer = observe(mealPlanner.recipes$);

      expect(observer.next).toHaveBeenCalledTimes(1);
      expect(observer.next).toHaveBeenCalledWith([]);
    });

    it('should emit recipes when added', async () => {
      const { mealPlanner } = createMealPlanner();

      const observer = observe(mealPlanner.recipes$);

      observer.mockClear();

      await mealPlanner.addRecipe(burger);
      await mealPlanner.addRecipe(salad);

      expect(observer.next).toHaveBeenCalledTimes(2);
      expect(observer.next).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({ name: 'Burger' }),
      ]);
      expect(observer.next).toHaveBeenNthCalledWith(2, [
        expect.objectContaining({ name: 'Burger' }),
        expect.objectContaining({ name: 'Salad' }),
      ]);
    });
  });

  describe('watchCanAddRecipe()', () => {
    it('should instantly emit if recipe can be added', () => {
      const { mealPlanner } = createMealPlanner();

      const observer = observe(mealPlanner.watchCanAddRecipe(burger));

      expect(observer.next).toHaveBeenCalledTimes(1);
      expect(observer.next).toHaveBeenCalledWith(true);
    });

    it(`should emit false when recipe is added and can't be added anymore`, async () => {
      const { mealPlanner } = createMealPlanner();

      const observer = observe(mealPlanner.watchCanAddRecipe(burger));

      observer.mockClear();

      await mealPlanner.addRecipe(burger);

      expect(observer.next).toHaveBeenCalledTimes(1);
      expect(observer.next).toHaveBeenCalledWith(false);
    });

    it(`should not emit if result didn't change`, () => {
      const { mealPlanner } = createMealPlanner();

      const observer = observe(mealPlanner.watchCanAddRecipe(burger));

      mealPlanner.addRecipe(burger);

      observer.mockClear();

      mealPlanner.addRecipe(salad);

      expect(observer.next).not.toBeCalled();
    });
  });

  function createMealPlannerWithBurger() {
    const { mealPlanner, ...rest } = createMealPlanner();

    mealPlanner.addRecipe(burger);

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
      getMealPlanner() {
        return TestBed.inject(MealPlanner);
      },
      mealRepoFake,
    };
  }
});
