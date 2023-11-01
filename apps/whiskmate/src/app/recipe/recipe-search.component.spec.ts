import { render, screen } from '@testing-library/angular';
import { recipeMother } from '../testing/recipe.mother';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';
import { userEvent } from '@testing-library/user-event';

jest.useFakeTimers();

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without filtering', async () => {
    const { getRecipeNames } = await renderComponent();

    expect(getRecipeNames()).toEqual(['Burger', 'Salad']);
  });

  it('should filter recipes using keywords', async () => {
    const { getRecipeNames, typeKeywords } = await renderComponent();

    await typeKeywords('Bur');

    expect(getRecipeNames()).toEqual(['Burger']);
  });

  async function renderComponent() {
    const fakeRepo = new RecipeRepositoryFake();

    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);

    const { detectChanges } = await render(RecipeSearchComponent, {
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
      async typeKeywords(keywords: string) {
        userEvent.type(screen.getByLabelText('Keywords'), keywords);
        /* wait for debounce. */
        await jest.advanceTimersByTimeAsync(1_000);
        detectChanges();
      },
    };
  }
});
