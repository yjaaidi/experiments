import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { MealPlanner } from '../meal-planner/meal-planner.service';
import { provideLocalStorageFake } from '../shared/local-storage.fake';
import { recipeMother } from '../testing/recipe.mother';
import { RecipeFilter } from './recipe-filter';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';
import { RecipeSearchHarness } from './recipe-search.harness';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { Recipe } from './recipe';

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without filtering', async () => {
    const { getRecipeNames } = await renderComponent();

    expect(await getRecipeNames()).toEqual(['Burger', 'Salad']);
  });

  it('should search recipes using given filter', async () => {
    const { getRecipeNames, updateFilter } = await renderComponent();

    updateFilter({
      keywords: 'Burg',
      maxIngredientCount: 3,
    });

    expect(await getRecipeNames()).toEqual(['Burger']);
  });

  it('should enable add button if recipe can be added', async () => {
    const { getFirstAddButton } = await renderComponent();

    const button = await getFirstAddButton();
    expect(await button.isDisabled()).toBe(false);
  });

  it('should add recipe to meal planner', async () => {
    const { getFirstAddButton, getMealPlannerRecipeNames } =
      await renderComponent();

    const button = await getFirstAddButton();
    await button.click();

    expect(await getMealPlannerRecipeNames()).toEqual(['Burger']);
  });

  it("should disable add button if can't add", async () => {
    const { getFirstAddButton } =
      await renderComponentWithBurgerInMealPlanner();

    /* Can't add burger because there is already a burger with the same id. */
    const button = await getFirstAddButton();
    expect(await button.isDisabled()).toBe(true);
  });

  async function renderComponentWithBurgerInMealPlanner() {
    const { mealPlanner, detectChanges, ...utils } = await renderComponent();

    mealPlanner.addRecipe(recipeMother.withBasicInfo('Burger').build());
    detectChanges();

    return { ...utils };
  }

  async function renderComponent() {
    const fakeRepo = new RecipeRepositoryFake();

    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: RecipeRepository,
          useValue: fakeRepo,
        },
        provideLocalStorageFake(),
      ],
    });

    TestBed.overrideComponent(RecipeSearchComponent, {
      set: {
        imports: [CommonModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    });

    const fixture = TestBed.createComponent(RecipeSearchComponent);
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RecipeSearchHarness
    );
    fixture.detectChanges();

    const mealPlanner = TestBed.inject(MealPlanner);

    return {
      mealPlanner,
      detectChanges() {
        fixture.detectChanges();
      },
      async getFirstAddButton() {
        return await harness.getFirstRecipeAddButton();
      },
      async getMealPlannerRecipeNames() {
        const recipes = await firstValueFrom(mealPlanner.recipes$);
        return recipes.map((recipe) => recipe.name);
      },
      async getRecipeNames() {
        const previewHarnesses = await harness.getRecipePreviews();
        return Promise.all(
          previewHarnesses.map(async (harness) => {
            const testElement = await harness.host();
            const recipe = (await testElement.getProperty('recipe')) as Recipe;
            return recipe.name;
          })
        );
      },
      updateFilter(filter: RecipeFilter) {
        fixture.debugElement
          .query(By.css('wm-recipe-filter'))
          .triggerEventHandler('filterChange', filter);
        fixture.detectChanges();
      },
    };
  }
});
