import { recipeMother } from '@whiskmate/recipe/core/testing';
import { firstValueFrom } from 'rxjs';
import { MealRepositoryDef } from './meal-repository';

export const verifyMealRepositoryContract = (
  createMealRepository: CreateMealRepository,
) => {
  const burger = recipeMother.withBasicInfo('Burger').build();
  const salad = recipeMother.withBasicInfo('Salad').build();

  it('should add recipe', async () => {
    const { mealRepo } = createMealRepository();

    await mealRepo.addMeal(burger);
    await mealRepo.addMeal(salad);

    expect(await firstValueFrom(mealRepo.getMeals())).toEqual([
      expect.objectContaining({ name: 'Burger' }),
      expect.objectContaining({ name: 'Salad' }),
    ]);
  });

  it('should return empty array initially', async () => {
    const { mealRepo } = createMealRepository();

    expect(await firstValueFrom(mealRepo.getMeals())).toEqual([]);
  });
};

type CreateMealRepository = () => {
  mealRepo: MealRepositoryDef;
};
