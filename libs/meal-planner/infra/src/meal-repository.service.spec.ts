import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { verifyMealRepositoryContract } from '@whiskmate/meal-planner/core/testing';
import { LocalStorage } from '@whiskmate/shared/infra';
import { provideLocalStorageFake } from '@whiskmate/shared/infra/testing';
import { MealRepository } from './meal-repository.service';

describe(MealRepository.name, () => {
  verifyMealRepositoryContract(createMealRepository);

  it('should return empty array when storage value is invalid', async () => {
    const { mealRepo, setStorageValue } = createMealRepository();

    setStorageValue('invalid-value');

    expect(await firstValueFrom(mealRepo.getMeals())).toEqual([]);
  });

  function createMealRepository() {
    TestBed.configureTestingModule({
      providers: [provideLocalStorageFake()],
    });

    const mealRepo = TestBed.inject(MealRepository);

    return {
      mealRepo,
      setStorageValue(value: string) {
        TestBed.inject(LocalStorage).setItem('meals', value);
      },
    };
  }
});
