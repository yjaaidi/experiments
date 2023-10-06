import { MealRepositoryFake } from './meal-repository.fake';
import { verifyMealRepositoryContract } from './meal-repository.contract';

describe(MealRepositoryFake.name, () => {
  verifyMealRepositoryContract(createMealRepositoryFake);

  function createMealRepositoryFake() {
    return { mealRepo: new MealRepositoryFake() };
  }
});
