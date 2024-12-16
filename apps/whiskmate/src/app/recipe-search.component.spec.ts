import { fireEvent, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { recipeMother } from '../testing/recipe.mother';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search.component';
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe(RecipeSearch.name, () => {
  it('should load all recipes initially', async () => {
    const { getRecipeNames } = await renderComponent();

    expect(getRecipeNames()).toEqual(['Burger', 'Salad', 'Beer']);
  });

  it('should filter recipes by keywords', async () => {
    const { getRecipeNames, typeKeywords } = await renderComponent();

    await typeKeywords('burger');

    expect(getRecipeNames()).toEqual(['Burger', 'Truffle Burger']);
  });

  it('should paginate recipes', async () => {
    const { getRecipeNames, clickNextPage } = await renderComponent();

    await clickNextPage();

    expect(getRecipeNames()).toEqual(['Truffle Burger', 'Greek Salad']);
  });

  it('should reset to first page when keywords change', async () => {
    const { clickNextPage, typeKeywords, getPreviousButton } =
      await renderComponent();

    await clickNextPage();

    await typeKeywords('burger');

    expect(getPreviousButton()).toBeDisabled();
  });

  async function renderComponent() {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideRecipeRepositoryFake(),
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
    TestBed.inject(RecipeRepositoryFake).setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Truffle Burger').build(),
      recipeMother.withBasicInfo('Greek Salad').build(),
    ]);
    const fixture = TestBed.createComponent(RecipeSearch);

    await fixture.whenStable();

    function getPreviousButton() {
      return screen.getByRole('button', { name: /previous/i });
    }

    return {
      getRecipeNames() {
        return screen.queryAllByRole('heading').map((el) => el.textContent);
      },
      async typeKeywords(keywords: string) {
        await userEvent.type(screen.getByRole('searchbox'), keywords);
        await fixture.whenStable();
      },
      async clickNextPage() {
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        await fixture.whenStable();
      },
      async clickPreviousPage() {
        fireEvent.click(getPreviousButton());
        await fixture.whenStable();
      },
      getPreviousButton,
    };
  }
});
