import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { RecipeSearchComponent } from './recipe-search.component';

jest.useFakeTimers();

describe(RecipeSearchComponent.name, () => {
  it.todo('🚧 should search recipes without filtering');

  it.todo('🚧 should filter recipes using keywords');

  async function renderComponent() {
    const { fixture } = await render(RecipeSearchComponent, {
      providers: [
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true
        }
      ],
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
        await fixture.whenStable();
      },
    };
  }
});
