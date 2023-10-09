import { MealRepository } from './meal-repository.service';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import { verifyMealRepositoryContract } from './meal-repository.contract';
import { LocalStorage, provideLocalStorageFake } from '@whiskmate/shared/infra';

describe(MealRepository.name, () => {
  verifyMealRepositoryContract(createMealRepository);

  it('should return empty array when storage value is invalid', async () => {
    const { mealRepo, setStorageValue } = createMealRepository();

    setStorageValue('invalid-value');

    expect(await lastValueFrom(mealRepo.getMeals())).toEqual([]);
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
