import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { recipeMother } from '@whiskmate/recipe/core/testing';
import { RecipeSearchComponent } from './recipe-search.component';
import { RecipeSearchHarness } from './recipe-search.harness';
import { provideRecipeRepositoryFake, RecipeRepositoryFake } from '@whiskmate/recipe/infra/testing';

describe(RecipeSearchComponent.name, () => {
  it('should search recipes without filtering', async () => {
    const { harness } = await renderComponent();

    expect(await harness.getRecipeNames()).toEqual(['Burger', 'Salad']);
  });

  async function renderComponent() {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [provideRecipeRepositoryFake()],
    });

    TestBed.inject(RecipeRepositoryFake).setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);

    const fixture = TestBed.createComponent(RecipeSearchComponent);
    await fixture.whenStable();

    return {
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        RecipeSearchHarness,
      ),
    };
  }
});
