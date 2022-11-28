import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MealPlanner } from './meal-planner.service';
import { RecipeFilter } from './recipe-filter';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';
import { RecipeRepositoryFake } from './testing/recipe-repository.fake';
import { recipeMother } from './testing/recipe.mother';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  detectChanges,
  get,
  getAll,
  getByDataRole,
  render,
} from './testing/utils';

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without keyword on load', async () => {
    const { getDisplayedRecipeNames } = await renderSearchComponent();

    expect(getDisplayedRecipeNames()).toEqual(['Beer', 'Burger']);
  });

  it('should search recipes using given filter', async () => {
    const { getDisplayedRecipeNames, updateFilter } =
      await renderSearchComponent();

    updateFilter({
      keywords: 'Bur',
    });

    expect(getDisplayedRecipeNames()).toEqual(['Burger']);
  });

  it('should allow adding recipe if not already present', async () => {
    const { getFirstAddButton } = await renderSearchComponent();

    expect(getFirstAddButton().isDisabled()).toBe(false);
  });

  it('should add recipe to meal planner', async () => {
    const { getFirstAddButton, getMealPlannerRecipes } =
      await renderSearchComponent();

    getFirstAddButton().click();

    expect(await getMealPlannerRecipes()).toMatchObject([
      {
        name: 'Beer',
      },
    ]);
  });

  it('should disable add button if recipe is already present', async () => {
    const { getFirstAddButton } = await renderSearchComponent();

    getFirstAddButton().click();

    expect(getFirstAddButton().isDisabled()).toBe(true);
  });

  async function renderSearchComponent() {
    const { render, ...rest } = await setUpSearchComponent();
    render();
    return rest;
  }

  async function setUpSearchComponent() {
    const fakeRepo = new RecipeRepositoryFake();
    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Burger').build(),
    ]);

    TestBed.overrideComponent(RecipeSearchComponent, {
      set: {
        providers: [
          {
            provide: RecipeRepository,
            useValue: fakeRepo,
          },
        ],
        /* Shallow test is at least 5x faster. */
        imports: [AsyncPipe, NgForOf],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    });

    const mealPlanner = TestBed.inject(MealPlanner);

    return {
      mealPlanner,
      render() {
        render(RecipeSearchComponent);
        detectChanges();
      },
      getDisplayedRecipeNames() {
        return getAll('wm-recipe-preview').map(
          (el) => el.properties['recipe'].name
        );
      },
      async getMealPlannerRecipes() {
        return firstValueFrom(mealPlanner.recipes$);
      },
      getFirstAddButton() {
        const el = getByDataRole('add-recipe');
        return {
          click() {
            el.triggerEventHandler('click');
            detectChanges();
          },
          isDisabled() {
            return el.properties['disabled'];
          },
        };
      },
      updateFilter(filter: RecipeFilter) {
        get('wm-recipe-filter').triggerEventHandler('filterChange', filter);
        detectChanges();
      },
    };
  }
});
