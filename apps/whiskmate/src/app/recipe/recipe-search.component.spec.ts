import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { Mocked, vi } from 'vitest';
import { recipeMother } from '../testing/recipe.mother';
import {
  RecipeRepository,
  RecipeRepositoryDef,
} from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';

vi.useFakeTimers();

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without filtering', async () => {
    const { getRecipeNames, repo } = await renderComponent();

    expect(getRecipeNames()).toEqual(['Burger', 'Salad']);
    expect(repo.search).toBeCalledTimes(1);
    expect(repo.search).toBeCalledWith(undefined);
  });

  it('should filter recipes using keywords', async () => {
    const { getRecipeNames, typeKeywords, repo } = await renderComponent();

    repo.search.mockClear();
    repo.search.mockReturnValue(
      of([recipeMother.withBasicInfo('Burger').build()])
    );

    await typeKeywords('Bur');

    expect(getRecipeNames()).toEqual(['Burger']);
    expect(repo.search).toHaveBeenCalledTimes(1);
    expect(repo.search).toHaveBeenCalledWith('Bur');
  });

  async function renderComponent() {
    const repo: Mocked<RecipeRepositoryDef> = {
      search: vi.fn(),
    };

    repo.search.mockReturnValue(
      of([
        recipeMother.withBasicInfo('Burger').build(),
        recipeMother.withBasicInfo('Salad').build(),
      ])
    );

    const { fixture } = await render(RecipeSearchComponent, {
      providers: [
        {
          provide: RecipeRepository,
          useValue: repo,
        },
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
      ],
    });

    return {
      repo,
      getRecipeNames() {
        return screen
          .queryAllByRole('heading', { level: 2 })
          .map((el) => el.textContent);
      },
      async typeKeywords(keywords: string) {
        userEvent.type(screen.getByLabelText('Keywords'), keywords);
        /* wait for debounce. */
        await vi.runAllTimersAsync();
        await fixture.whenStable();
      },
    };
  }
});
