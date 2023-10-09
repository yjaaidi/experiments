import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { RecipeSearchComponent } from './recipe-search.component';
import { RecipeSearchHarness } from './recipe-search.harness';
import { recipeMother } from '@whiskmate/recipe-shared/core';
import {
  RecipeRepository,
  RecipeRepositoryFake,
} from '@whiskmate/recipe/infra';

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without filtering', async () => {
    const { harness } = await renderComponent();

    expect(await harness.getRecipeNames()).toEqual(['Burger', 'Salad']);
  });

  async function renderComponent() {
    const fakeRepo = new RecipeRepositoryFake();

    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: RecipeRepository,
          useValue: fakeRepo,
        },
      ],
    });

    const fixture = TestBed.createComponent(RecipeSearchComponent);
    fixture.detectChanges();

    return {
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        RecipeSearchHarness
      ),
    };
  }
});
