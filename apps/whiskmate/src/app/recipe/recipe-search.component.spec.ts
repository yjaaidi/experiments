import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { recipeMother } from '../testing/recipe.mother';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { RecipeSearchComponent } from './recipe-search.component';

vi.useFakeTimers();

describe(RecipeSearchComponent.name, () => {
  it(
    'should search recipes without filtering',
    autoAdvanceTime(async () => {
      const { getRecipeNames } = await renderComponent();

      await waitFor(() =>
        expect(getRecipeNames()).toEqual(['Burger', 'Salad']),
      );
    }),
  );

  it(
    'should filter recipes using keywords',
    autoAdvanceTime(async () => {
      const { getRecipeNames, typeKeywords } = await renderComponent();

      await typeKeywords('Bur');

      await waitFor(() => expect(getRecipeNames()).toEqual(['Burger']));
    }),
  );

  it(
    'should show "no results" message when no recipes match',
    autoAdvanceTime(async () => {
      const { getRecipeNames, typeKeywords } = await renderComponent();

      await typeKeywords('arecipethatdoesnotexist');

      await waitFor(() => {
        expect(getRecipeNames()).toEqual([]);
        expect(
          screen.getByText('no results', {
            exact: false,
          }),
        ).toBeVisible();
      });
    }),
  );

  async function renderComponent() {
    await render(RecipeSearchComponent, {
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
        await userEvent.type(screen.getByLabelText('Keywords'), keywords);
      },
    };
  }
});

function autoAdvanceTime(testFn: () => void | Promise<void>) {
  return async () => {
    let isTestRunning = true;

    /* Keep advancing time until the test is finished. */
    (async () => {
      while (isTestRunning) {
        await vi.advanceTimersToNextTimerAsync();
      }
    })();

    try {
      await testFn();
    } finally {
      isTestRunning = false;
    }
  };
}
