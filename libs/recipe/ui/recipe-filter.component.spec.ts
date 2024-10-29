import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeFilter } from '@whiskmate/recipe/core';
import { RecipeFilterComponent } from './recipe-filter.component';
import { RecipeFilterHarness } from './recipe-filter.harness';
import { createObserver } from '@whiskmate/shared/util-testing';

describe(RecipeFilterComponent.name, () => {
  const { observe } = createObserver();

  it('should trigger filterChange output', async () => {
    const { component, harness } = await renderComponent();

    const observer = observe(component.filterChange);

    await harness.setValue({
      keywords: 'Cauliflower',
      maxIngredientCount: 3,
      maxStepCount: 10,
    });

    expect(observer.next).toHaveBeenLastCalledWith({
      keywords: 'Cauliflower',
      maxIngredientCount: 3,
      maxStepCount: 10,
    } as RecipeFilter);
  });

  async function renderComponent() {
    TestBed.configureTestingModule({ imports: [NoopAnimationsModule] });
    const fixture = TestBed.createComponent(RecipeFilterComponent);
    await fixture.whenStable();

    return {
      component: fixture.componentInstance,
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        RecipeFilterHarness,
      ),
    };
  }
});
