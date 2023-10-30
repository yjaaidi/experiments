import { render, screen } from '@testing-library/angular';
import { recipeMother } from '../testing/recipe.mother';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without filtering', async () => {
    const { getRecipeNames } = await renderComponent();

    expect(getRecipeNames()).toEqual(['Burger', 'Salad']);
  });

  async function renderComponent() {
    const fakeRepo = new RecipeRepositoryFake();

    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);

    await render(RecipeSearchComponent, {
      providers: [
        {
          provide: RecipeRepository,
          useValue: fakeRepo,
        },
      ],
    });

    return {
      getRecipeNames() {
        return screen
          .getAllByRole('heading', { level: 2 })
          .map((el) => el.textContent);
      },
    };
  }
});
