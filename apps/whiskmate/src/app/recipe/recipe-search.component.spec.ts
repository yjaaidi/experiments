import { render, screen } from '@testing-library/angular';
import { RecipeSearchComponent } from './recipe-search.component';
import { userEvent } from '@testing-library/user-event';
import { recipeMother } from '../testing/recipe.mother';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';

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

  it('should show "no results" message when no recipes match', async () => {
    const { getRecipeNames, typeKeywords } = await renderComponent();

    await typeKeywords('arecipethatdoesnotexist');

    expect(getRecipeNames()).toEqual([]);
    expect(
      screen.getByText('no results', {
        exact: false,
      })
    ).toBeVisible();
  });

  async function renderComponent() {
    const { detectChanges } = await render(RecipeSearchComponent, {
      configureTestBed: (testBed) =>
        testBed
          .inject(RecipeRepositoryFake)
          .setRecipes([
            recipeMother.withBasicInfo('Burger').build(),
            recipeMother.withBasicInfo('Salad').build(),
          ]),
      providers: [provideRecipeRepositoryFake()],
    });

    return {
      getRecipeNames() {
        return screen
          .queryAllByRole('heading', { level: 2 })
          .map((el) => el.textContent);
      },
      async typeKeywords(keywords: string) {
        userEvent.type(screen.getByLabelText('Keywords'), keywords);
        /* wait for debounce. */
        await jest.runAllTimersAsync();
        detectChanges();
      },
    };
  }
});
