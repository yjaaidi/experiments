import { render, screen } from '@testing-library/angular';
import { RecipeSearchComponent } from './recipe-search.component';
import { userEvent } from '@testing-library/user-event';
import {
  RecipeRepository,
  RecipeRepositoryDef,
} from './recipe-repository.service';
import { of } from 'rxjs';
import { recipeMother } from '../testing/recipe.mother';

jest.useFakeTimers();

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

  it.todo('should show "no results" message when no recipes match');

  async function renderComponent() {
    const repo: jest.Mocked<RecipeRepositoryDef> = {
      search: jest.fn(),
    };

    repo.search.mockReturnValue(
      of([
        recipeMother.withBasicInfo('Burger').build(),
        recipeMother.withBasicInfo('Salad').build(),
      ])
    );

    const { detectChanges } = await render(RecipeSearchComponent, {
      providers: [
        {
          provide: RecipeRepository,
          useValue: repo,
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
        await jest.runAllTimersAsync();
        detectChanges();
      },
    };
  }
});
