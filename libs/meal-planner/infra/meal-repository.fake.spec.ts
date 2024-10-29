import { verifyMealRepositoryContract } from '@whiskmate/meal-planner/core/testing';
import { MealRepositoryFake } from './meal-repository.fake';

describe(MealRepositoryFake.name, () => {
  verifyMealRepositoryContract(createMealRepositoryFake);

  function createMealRepositoryFake() {
    return { mealRepo: new MealRepositoryFake() };
  }
});
