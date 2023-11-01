import { render, screen } from '@testing-library/angular';
import { RecipeSearchComponent } from './recipe-search.component';
import { userEvent } from '@testing-library/user-event';

jest.useFakeTimers();

describe(RecipeSearchComponent.name, () => {
  it.todo('🚧 should search recipes without filtering');

  it.todo('🚧 should filter recipes using keywords');

  async function renderComponent() {
    const { detectChanges } = await render(RecipeSearchComponent);

    return {
      getRecipeNames() {
        return screen
          .queryAllByRole('heading', { level: 2 })
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
