import { ComponentFixture } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RecipeSearchComponent from './recipe-search.component';

vi.useFakeTimers();

describe(RecipeSearchComponent.name, () => {
  it.todo('🚧 should search recipes without filtering');

  it.todo('🚧 should filter recipes using keywords');

  async function renderComponent() {
    const { fixture } = await render(RecipeSearchComponent);

    await advanceTime(fixture);

    return {
      getRecipeNames() {
        return screen
          .queryAllByRole('heading', { level: 2 })
          .map((el) => el.textContent);
      },
      async typeKeywords(keywords: string) {
        userEvent.type(screen.getByLabelText('Keywords'), keywords);
        /* wait for debounce. */
        await advanceTime(fixture);
      },
    };
  }
});

async function advanceTime(fixture: ComponentFixture<unknown>) {
  const promise = fixture.whenStable();
  await vi.runAllTimersAsync();
  await promise;
}
