import { RecipeRepositoryFake } from './recipe-repository.fake';
import { verifyRecipeRepositoryContract } from './recipe-repository.contract';
import { TestBed } from '@angular/core/testing';
import { recipeMother } from '../testing/recipe.mother';

xdescribe(RecipeRepositoryFake.name, () => {
  verifyRecipeRepositoryContract({
    setUp,
  });
});

function setUp() {
  const repo = TestBed.inject(RecipeRepositoryFake);
  repo.setRecipes([
    recipeMother.withBasicInfo('Burger').build(),
    recipeMother.withBasicInfo('Salad').build(),
  ]);

  return {
    repo,
  };
}
