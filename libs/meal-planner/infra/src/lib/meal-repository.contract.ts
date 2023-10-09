import { lastValueFrom } from 'rxjs';
import { MealRepositoryDef } from './meal-repository.service';
import { recipeMother } from '@whiskmate/recipe-shared/core';

export const verifyMealRepositoryContract = (
  createMealRepository: CreateMealRepository
) => {
  const burger = recipeMother.withBasicInfo('Burger').build();
  const salad = recipeMother.withBasicInfo('Salad').build();

  it('should add recipe', async () => {
    const { mealRepo } = createMealRepository();

    await lastValueFrom(mealRepo.addMeal(burger));
    await lastValueFrom(mealRepo.addMeal(salad));

    expect(await lastValueFrom(mealRepo.getMeals())).toEqual([
      expect.objectContaining({ name: 'Burger' }),
      expect.objectContaining({ name: 'Salad' }),
    ]);
  });

  it('should return empty array initially', async () => {
    const { mealRepo } = createMealRepository();

    expect(await lastValueFrom(mealRepo.getMeals())).toEqual([]);
  });
};

type CreateMealRepository = () => {
  mealRepo: MealRepositoryDef;
};
